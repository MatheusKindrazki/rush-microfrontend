# Modelos de teste

![models](./images/models.png)

Neste capítulo traremos instruções com um direcionamento específico, com o objetivo de explicar diferentes modalidades de teste encontradas no Hub, traremos exemplos de situações reais dos testes da aplicação com uma descrição do que foi feito, como foi feito, e por que foi feito.

1. **[Testes de utilitários](#testes-de-utilitários)**<br/>
2. **[Testes de Componentes](#testes-de-componentes)**<br/>
   2.1. **[Common](#common)**<br/>
   2.2. **[Teste com snapshot](#teste-com-snapshot)**<br/>
   2.3. **[Testes que simulam a interação do usuário](#testes-que-simulam-a-interação-do-usuário)**<br/>
   2.4. **[Hub Web](#hub-Web)**<br/>
3. **[Testes das páginas](#estes-das-páginas)**<br/>
4. **[Testes de módulos da store](#estes-de-módulos-da-store)**<br/>
   4.1. **[Actions](#actions)**<br/>
   4.2. **[Reducers](#reducers)**<br/>
   4.3. **[Sagas](#sagas)**<br/>
5. **[Hooks customizados](#hooks-customizados)**<br/>

## Testes de utilitários

No hub os utilitários são testados de forma isolada a partir da criação de mocks, criados com o propósito de cobrir todas as linhas de código, funções e possíveis caminhos da funcionalidade que será testada.
Abaixo segue um exemplo de teste de utilitário no Hub:

```jsx
jest.mock('react-router-dom', () => {
  const ui = jest.requireActual('react-router-dom')
  return {
    ...ui,
    useLocation: jest
      .fn(() => ({
        pathname: mockedPathname
      }))
      .mockImplementationOnce(() => ({
        pathname: 'test/mock/path/fake-parameter/'
      })),
    useParams: () => ({
      solution: mockedParams
    }),
    useHistory: () => ({
      push: mockedPush
    })
  }
})

describe('postMessage should work properly', () => {
  afterEach(jest.clearAllMocks)

  it('shouldnt redirect when mounted URL is equal current pathname', async () => {
    const event = new CustomEvent('message') as CustomMessageEvent

    const dataObject = {
      event: 'history-change',
      data: 'http://teste.com'
    }

    renderHook(() => usePostMessage())

    event.data = JSON.stringify(dataObject)

    window.dispatchEvent(event)

    expect(mockedPush).not.toHaveBeenCalled()
  })
```

Destaca-se o uso do jest.mock atribuindo funções mockadas aos métodos do react-router-dom, isolando a funcionalidade a ser testada das bibliotecas externas utilizadas pelo código.

## Testes de Componentes

Com diversos componentes e páginas, o hub utiliza de testes unitários e end-to-end para a cobertura de código do projeto.

### Common

Nos **common**, módulo da aplicação que disponibiliza utilitários comuns entre a aplicação, estão a grande maioria dos componentes importados pelo Chakra-ui. Utiliza-se [snapshots](https://www.notion.so/Come-ando-com-os-testes-2a64aef7be704547877fc346e9a8faa2) para o teste de componentes mais simples — como é o caso de um Button — e, para casos mais complexos, que possuem lógica mais presente, utiliza-se da [simulação do comportamento do usuário](https://www.notion.so/Come-ando-com-os-testes-2a64aef7be704547877fc346e9a8faa2).

#### Teste com snapshot

```jsx
it('Button matches snapshot', () => {
  const wrapper = render(<Button />)
  expect(wrapper).toMatchSnapshot()
})
```

_Disponível em packages/common/**tests**/components/Button.spec.tsx_

Caso o resultado renderizado pelo componente Button seja alterado, os testes apontarão essa mudança através da comparação com o snapshot antigo, informando para a pessoa desenvolvedora que seja feita a atualização do snapshot.

**NOTA: A atualização do snapshot acontece automaticamente ao rodar os testes, a não ser que seja configurado previamente que eles falhem antes do [snapshot update](https://jestjs.io/docs/snapshot-testing#updating-snapshots).**

#### Testes que simulam a interação do usuário

```jsx
it('Input should call onChange with correct value', () => {
  const onChange = jest.fn()
  const { getByTestId } = render(<Search onChange={onChange} />)

  const value = 'test input value'
  const searchInput = getByTestId('search-input')
  fireEvent.change(searchInput, { target: { value } })
  expect(onChange).toHaveBeenCalledWith(value)
}
```

_Disponível em packages/common/**tests**/components/Search.spec.tsx_

Este modelo de teste são utilizados em componentes que utilizam alguma lógica para funcionar. Como por exemplo, o componente (Search) que precisa chamar uma função (onChange) que lida com a alteração do valor digitado pelo usuário no input.

### Hub Web

Os componentes presentes no Hub não fogem muito do escopo dos [common](https://www.notion.so/Come-ando-com-os-testes-2a64aef7be704547877fc346e9a8faa2), mas alguns diretórios utilizam de diversas funções e módulos disponíveis no repositório, fazendo com que seus testes sejam mais complexos. A partir daqui, sugere-se que a seção de **mocks** e **setup de testes** esteja bem compreendida.

```jsx
it('Should dispatch an `@user/USER_PASSWORD_PANEL_REQUEST` action if the form has been submitted with correct data', async () => {
  const { inputs, alterButton, storeUtils } = setup()

  expect(inputs.length).toBe(3)

  const password = 'password'

  inputs.forEach(input => {
    fireEvent.change(input, { target: { value: password } })
  })
  await waitFor(() => fireEvent.click(alterButton))

  const action = storeUtils?.getActions()
  expect(action).toStrictEqual([
    {
      payload: {
        confirmNewPassword: password,
        newPassword: password,
        oldPassword: password
      },
      type: '@user/ USER_PASSWORD_PANEL_REQUEST'
    }
  ])
})
```

_Disponível em packages/apps/web/src/**tests**/components/Header/AlterPass.spec.tsx_

Este teste passa pelo componente de alteração de senha, que está presente no Header do Hub, inserindo um `password` válido genérico para a tentativa de trocar a senha.

Manobrando as assincronicidade do componente, testa-se se uma ação é disparada através do redux quando todos os dados inseridos nos inputs são válidos e foram submetidos.

Ou seja, basicamente verificamos se o componente renderiza 3 inputs, e após isso, inserimos o mesmo value em todos. Clicamos no botão "Alterar senha" e esperamos que haja sucesso na asserção já explicada.

## Testes das páginas

As páginas do Hub são as responsáveis por unir grande parte dos componentes e funcionalidades presentes nos pacotes **(packages)**. Em sua maioria, elas são responsáveis por disparar ações (de forma indireta) para o gerenciador de estado, e também por renderizar em tela a interface que o usuário está prestes a interagir. Tendo isso em vista, com testes end-to-end simula-se o comportamento do usuário com esses componentes React, movendo cada peça da forma que a pessoa usuária faria. Espera-se que as páginas se comportem como deveriam, e isso é confirmado através dos **testes das páginas**.

**Utilizaremos o seguinte exemplo (testes da página de Login do Hub) para analisarmos o modelo em que estes testes são criados:**

```jsx
// etc
it('should dispatch @auth/SIGN_IN REQUEST with the right payload if the user data format is correct', async () => {
  const userMock = {
    username: 'teste',
    password: 'passwordteste'
  }

  const { username, password } = userMock
  const { getByTestId } = setup({})

  const usernameInput = getByTestId('email')
  const passwordInput = getByTestId('password')
  const submitButton = getByTestId('submit-button')
  const form = getByTestId('submit-form')

  fireEvent.change(usernameInput, { target: { value: username } })
  fireEvent.change(passwordInput, {
    target: { value: password }
  })

  expect(submitButton).toHaveProperty('type', 'submit')
  expect(usernameInput).toHaveValue(username)
  expect(passwordInput).toHaveValue(password)

  await waitFor(() => fireEvent.submit(form))
  expect(spyValidate).toHaveBeenCalled()
  expect(dispatch).toHaveBeenCalledWith({
    payload: {
      ...userMock,
      redirect: undefined
    },
    type: '@auth/SIGN_IN_REQUEST'
  })
})
/// ...continua
```

_Disponível em:_ _packages/apps/web/src/**tests**/pages/Auth/SignIn.spec.tsx_

Como é possível observar, inicia-se os testes chamando os mocks de usuário e logo em seguida busca-se pelos elementos em tela.

Em grande parte dos casos utilizamos o **getBy[Algo*]** para buscar os elementos em tela. Neste exemplo, o getByTestId busca através dos data-testid's anteriormente inseridos nas páginas para o suporte dos testes. Em caso de buscas assíncronas, recomenda-se a utilização do **findBy[Algo*]**, e caso seja algo que talvez possa não estar na tela, utiliza-se o **queryBy[Algo*]** — \*\*\*\*que não para a execução dos testes com uma falha, porém retorna `null` caso o objeto de busca não seja encontrado, diferentemente das outras soluções.

**[Algo*]: _Este alias indica que podemos chamar qualquer método de busca do react testing library com os prefixos citados a sua frente. Por exemplo: getByTestId, getByText, getByPlaceholder, etc._**

Após encontrar os elementos em tela, simula-se uma tentativa de login e espera-se que a action certa tenha sido disparada com o payload correto, neste caso a _@auth/SIGN_IN REQUEST_.

No geral, os testes de todas as páginas funcionam desta mesma maneira: simula-se a interação do usuário e espera-se que o correto aconteça.

## Testes de módulos da store

Estes buscam testar as actions, os reducers e as sagas que compõem os módulos da Redux Store que armazena os estados do projeto, vide [documentação do hub](https://www.notion.so/README-md-3469b6b8dc4842b490cc6897c9bae0cf).
A estrutura de pastas dos testes da store respeita a organização proposta nos arquivos do hub, dividindo os testes em módulos e cada módulo com seus testes de actions, reducers e sagas.

Para os testes das actions e reducers, seguimos as diretrizes trazidas pela [documentação do Redux](https://redux.js.org/recipes/writing-tests#action-creators).

### Actions

Como aqui tratamos de funções puras criadoras de actions, os testes são muito simples, criados com uma aproximação simples e direta das funções que serão testadas, abaixo segue um exemplo:

```jsx
it('should create an success action with productSuccess', () => {
  const payload = {
    frameUrl: 'http://produto/teste.com',
    frameName: 'Produto'
  }
  const expectedAction = {
    type: mockedTypes.PRODUCT_SUCCESS,
    payload
  }
  expect(productSuccess(payload)).toEqual(expectedAction)
})
```

Nota-se na prática a simplicidade do testes de funções puras, os testes são claros e diretos, sem a necessidade de mockar fatores externos, uma vez que eles não estarão presentes em funções puras criadoras de actions.

### Reducers

Assim como nas actions, aqui também trataremos de funções puras, seguindo as mesmas orientações apontadas no subcapítulo anterior, a aproximação dos testes se dará de maneira simples e direta, como se pode constatar no snippet abaixo:

```jsx
it('should set loading to false and reset data on product failure action', () => {
  expect(products(initialState, productFailure())).toEqual({
    loading: false,
    data: []
  })
})

it('should set loading to true and reset data on without access action', () => {
  expect(products(initialState, withoutAccess())).toEqual({
    loading: true,
    data: []
  })
})

it('should set frameURL and frame name on frame URL action', () => {
  const payload = {
    url: 'http://produto/teste.com',
    name: 'Produto'
  }
  expect(products(initialState, setFrameURL(payload))).toEqual({
    frameName: 'Produto',
    frameUrl: 'http://produto/teste.com',
    loading: true,
    data: []
  })
})
```

Ressalta-se a ideia de que não existem efeitos colaterais nas funções puras, sendo assim os testes sao feitos com asserções baseadas na lógica de que os mesmos _inputs_ sempre retornarão os mesmos _outputs_.

### Sagas

Aqui concentra-se a lógica assíncrona presente dos módulos da store, como estamos utilizando um middleware que opera a partir de funções geradores, a execução das funcionalidades se dá através de um método nativo do Redux Saga a [Run Saga](https://redux-saga.js.org/docs/api/#middlewarerunsaga-args).
Os testes das sagas do Hub buscam cobrir todo o fluxo bem como todas as possibilidades que existem dentro da função geradora, como denota o exemplo abaixo, extraído de parte do teste de uma saga:

```jsx
describe('testing getProducts saga flow', () => {
  let dispatchedActions = store.getActions()

  mockState.profile = { guid: 'PROFESSOR' } as any
  mockState.educationalStage = { level: 'level' } as any
  mockState.user = {
    user: 'fake user',
    school: { value: 'fake school' }
  } as any

  const spyApiGet = jest
    .spyOn(api, 'get')
    .mockImplementation(() => Promise.resolve<any>(mockedApiGetResponse))

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    store.clearActions()

    dispatchedActions = store.getActions()
  })
	it('should call toast error when api returns with an error', async () => {
	    mockState.profile = { guid: 'guid' } as any
	    const mockedApiErrorResponse = { ok: false, status: 500 }
	    spyApiGet.mockImplementation(() =>
	      Promise.resolve<any>(mockedApiErrorResponse)
	    )
	    const spyToast = jest.spyOn(toast, 'error')
	    await runSaga(store, getProducts).toPromise()
	    expect(dispatchedActions).toContainObject(loading(true))
	    expect(spyToast).toHaveBeenCalledWith(
	      'Erro ao buscar soluções, tente novamente mais tarde!'
	    )
	 })
})
```

Primeiramente destaca-se o setup utilizado no inicio do describe, que define através da variável _mockState_ os estados que serão utilizados durante o teste, vale lembrar que o mockState é um objeto estático, e as mudanças feitas dentro de um describe permanecerão mesmo depois de finalizada a execução deste.

Vale ressaltar também a utilização do método de asserção _toContainObject_, que não é uma ferramenta nativa do Jest. Trata-se de uma funcionalidade criada dentro do do Hub com a finalidade de fazer asserções mais curtas e diretas sobre as actions disparadas durante a execução das sagas.

É notável a ideia de isolamento de dependencias no teste das sagas, primeiramente é feito o mock da chamada a api que será realizada, e das demais dependencias a serem utilizadas. Logo após será realizada a execução da saga com o método run saga, que percorrerá o percurso da saga recebida como parametro. Finalmente, passamos a realizar asserções a respeito da execução, como despacho de ações, chamadas a api ou outras dependencias.

## Hooks customizados

Os testes de Hooks Customizados, assemelham-se a testes funcionais, uma vez que o foco se dará nas regras de negocio do Hook a ser testado. Como a execução de um Hook depende de varios fatores externos a ele, como o contexto, o estado atual da aplicação e a chamada de outras dependencias o setup feito deverá ser completo ao mockar e configurar os aspectos alheios ao Hook, como podemos ver no exemplo a seguir:

```jsx
describe('useSentry hook should work properly', () => {
  const setUser = jest.fn()
  const setContext = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('If environment is `production`, this hook should call its methods correctly', () => {
    process.env.REACT_APP_NODE_ENV = 'production'
    const info = {
      guid: 'guid',
      username: 'username',
      email: 'email'
    }

    const school = {
      label: 'label'
    }
    const name = 'name'
    const level = 'level'

    jest.spyOn(Sentry, 'setUser').mockImplementation(setUser)
    jest.spyOn(Sentry, 'setContext').mockImplementation(setContext)
    jest.spyOn(redux, 'useSelector').mockReturnValue({
      info,
      school,
      name,
      level
    })

    renderHook(() => useSentry())

    expect(setUser).toHaveBeenCalledWith({
      email: info.email,
      id: info.guid,
      username: info.username
    })
    expect(setContext).toHaveBeenCalledWith('user_info', {
      educational_stage: level,
      email: info.email,
      id: info.guid,
      role: name,
      school: school.label,
      username: info.username
    })
  })
```

É visível o nível de complexidade do setup utilizado para testar determinados Hooks customizados do React. A maior parte do teste acima destina-se a preparar o ambiente em que o Hook será executado, somente após os mocks serem configurados, e o ambiente estiver pronto para a execução do Hook, será feita a chamada da função renderHook, e somente então serão realizadas as asserções a respeito do Hook que está sendo testado.

Importante lembrar que a função \**[renderHook](https://react-hooks-testing-library.com/usage/basic-hooks) é uma feature nativa da biblioteca do *React Testing Library*, e realiza muito mais do que só executar um Hook customizado com finalidades de teste. Esta função poderá prover um retorno para asserções diretas sobre o retorno do *Hook\* e também lhe permite realizar alterações de estado entre as renderizações.
