# Utilitários para testes

![utils](./images/utils.png)

1. **[Mocks](#começando-com-os-mocks)**
2. **[Fake Store](#fake-store)**
3. **[Renderização com contexto](#renderização-com-contexto)**<br />
   3.1. **[Parâmetros da função render modificada.](#parâmetros-da-função-render-modificada)**
4. **[Padronizações](#padronizações)**<br />
   4.1. **[Funcionalidades nativas](#funcionalidades-nativas)**<br />
   4.2. **[Idioma](#idioma)**<br />
   4.3. **[Suite](#suite)**<br />
   4.4. **[Setup de testes](#setup-de-testes)**
5. **[Onde escrever os testes e como nomeá-los](#onde-escrever-os-testes-e-como-nomeá-los)**
6. **[Quando criar mocks](#quando-criar-mocks)**

# Começando com os Mocks

Com diretório disponível em _packages/apps/web/src/**mocks**_, os mocks são arquivos gerados para auxiliar no teste de funções e componentes que necessitam de informações específicas para serem testados.

Em alguns casos, por exemplo, precisa-se renderizar uma página com informações pré-definidas (como informações de usuário, escolas, etc.), e esses mocks servem como uma forma de centralizar essas informações em um só lugar, evitando duplicação de código e, dessa forma, deixando os testes mais legíveis e limpos.

**Veja abaixo um trecho de código que demonstra um formato bastante comum de um mock presente no Hub:**

```json
"user": {
  "name": "John Doe",
  "integration_id": "1122" ,
  "id": "",
  "guid": "6d45f4f8-3326-4856-a29d-36216b2e4e2c",
  "username":"john.doe",
  "email": "johndoe@teste.com",
  "schools": [{
    "id": "21694ec0-88be-4231-ac2a-392dbf845518",
    "name": "Escola Positivo",
    "roles": [
      "PAIS_E_RESPONSAVEIS",
      "COORDENADOR",
      "PROFESSOR",
      "ADMINISTRADOR"
    ]
  }]
}
```

_Trecho disponível em: packages/apps/web/src/**mocks**/store/user.mock.json_

Através desse **mock**, poupamos que seja escrito um `[json](https://www.json.org/json-en.html)` que simula as informações de usuário em diversas funções e componentes que precisam dessas informações bem definidas. **É só importar e usar!**

### Fake Store

No mesmo diretório de mocks, existe também uma `store` totalmente fake (falsa)! Essa Store foi criada com o intuito de auxiliar nos testes que há a necessidade da utilização de uma Store. Ela funciona basicamente como a Store original, mas com alguns detalhes que fazem toda a diferença na hora de criar os testes:

- Ela disponibiliza um método chamado `getActions()` que, ao ser acionado, retorna todas as Actions que foram disparadas no momento de execução do componente/função;
- Também pode-se utilizar o `clearActions()`, este é responsável por limpar o `array` de Actions que é disponibilizado pelo método `getActions()`;
- Disponibiliza um [spyOn](https://jestjs.io/docs/jest-object#jestspyonobject-methodname) dos métodos `dispatch()` e `getState()`.

Além de várias outras utilidades que podem ser exploradas na documentação oficial do `[redux-mock-store](https://github.com/reduxjs/redux-mock-store)` — pacote utilizado para a criação da store falsa.

### Renderização com contexto

Se pudéssemos definir essa funcionalidade em uma frase, com certeza seria: **utilitário mais importante para os testes de componentes e páginas React que precisam utilizar a store!**

O "Render com contexto" — nomenclatura utilizada por convenção pela comunidade React — é uma função responsável por renderizar uma página ou componente React com o contexto da aplicação, ou seja, todas as informações que é minimamente necessária para gerar uma renderização específica!

Com o intuito de não deixar as coisas muito complexas, demonstraremos apenas como funciona sua utilização, porém, sua implementação está disponível em _packages/libs/test-utils/index.tsx._

**Veja abaixo como renderizar uma página que necessita de um contexto previamente definido:**

```jsx
render(<Home />, {
  store,
  reducers: ['user', 'profile', 'educationalStage', 'products', 'global'],
  CUSTOM_STATE: { ...defaultItemsInState, ...contextConfig }
})
```

_Trecho disponível em packages/apps/web/**tests**/pages/Home.spec.tsx_

### Parâmetros da função render modificada

A função é importada do pacote `test-utils` com o nome `render` e sua utilização pode ser feita utilizando dois argumentos:

**Ui (Obrigatório)**: Primeiro argumento, deve ser o componente ou página que será renderizada, neste exemplo é a `<Home />`

**Opções (Opcional)**: Um objeto que recebe todas as opções já aceitas pelo [render](https://testing-library.com/docs/react-testing-library/api/#render) do React testing library, mas com alguns adicionais:

- **store**: recebe uma store, podendo ser a original da aplicação ou até mesmo uma falsa, como a já citada no tópico de [store falsa](#fake-store), em mocks.
- **reducers**: nesta chave deve ser passada um `array` de `string` onde cada elemento deve ser, **obrigatoriamente**, o nome de um reducer da store. Neste exemplo, a página home utiliza 5 reducers, e todos estão inseridos dentro do array. **A ordem é irrelevante**.
- **CUSTOM_STATE**: Estado customizado para inicialização da store.

  Este tópico ficará melhor entendido no próximo tópico, em [setup de testes](#setup-de-testes). Mas basicamente é uma chave que recebe o estado inicial da aplicação, **não sendo obrigatório**, pois a store já tem por padrão um estado inicial programado.

Caso uma store seja definida nas opções, é **obrigatório** a definição dos reducers que esta store utiliza na página/componente.

3.1.1 **Retorno da função:**

A função `render` retorna todos os métodos já devolvidos pelo render do react testing library e, além disso, um objeto chamado `storeUtils` que contém os dois métodos citados no tópico de [Fake Store](#fake-store): `getActions` e `clearActions`.

## Padronizações

Neste tópico será abordado algumas padronizações e convenções adotadas pela equipe que são fortemente recomendadas seguir na hora de escrever novos testes (ou até refatorar testes existentes).

### Funcionalidades nativas

É preferível que sempre utilizemos ferramentas nativas ou já instaladas no projeto para a criação dos testes. Ou seja, é estritamente contra nossos padrões fazer a instalação de bibliotecas desnecessárias. Sempre opte pelo já existente. Em casos mais específicos, recomendamos a utilização de _libs_ normalmente sugeridas na documentação oficial do Jest e React testing library.

### Idioma

Todos os testes devem ser escritos em inglês. É preferível que todas as variáveis criadas nos testes utilizem do mesmo parâmetro.

### Suite

Todos os testes que possuem mais de um `it/test` devem, obrigatoriamente, possuir uma suite de teste, ou seja, um `describe` englobando os mesmos.

### Setup de testes

**O setup de testes que falaremos aqui não é o setup do jest**. É uma convenção utilizada nos testes para inibir duplicação de código, além de deixar os testes mais funcionais e legíveis.

Ainda utilizando o [exemplo visto em render com contexto](#renderização-com-contexto), demonstraremos uma visão mais ampla de como utilizamos esta convenção:

4.4.1 **Estado inicial padrão**

```jsx
const defaultItemsInState: CustomState = {
  user: {
    info: {
      name: 'Firstname Lastname',
      school: {
        label: 'Escola Positivo ON SPE 18-005'
      }
    }
  },
  profile: {
    name: 'Administrador'
  },
  products: {
    loading: false,
    data: mockedCards
  }
}
```

_Trecho disponível em packages/apps/web/**tests**/pages/Home.spec.tsx (Remodulado para fins didáticos)_

Neste trecho criamos um objeto para organizar o estado que se repete em toda renderização, inserimos um estado inicial para user, profile e products (reducers) dentro do objeto para ser utilizado dentro do setup.

Observação: **Não é obrigatório!**

4.4.2 **Setup**

```jsx
const setup = (contextConfig: CustomState = {}) => {
  const utils = render(<Home />, {
    store,
    reducers: ['user', 'profile', 'educationalStage', 'products', 'global'],
    CUSTOM_STATE: { ...defaultItemsInState, ...contextConfig }
  })
  const { getByTestId } = utils
  const searchInput = getByTestId('search-input')

  return { searchInput, ...utils }
}
```

_Trecho disponível em packages/apps/web/**tests**/pages/Home.spec.tsx_

Este setup é criado antes de qualquer teste. Por convenção, colocamos tudo que se repete entre os testes, além de receber por parâmetro algo que pode ser customizado em cada chamada, neste caso somente o estado inicial que será inserido do `CUSTOM_STATE`, ficando a critério de quem chama o setup inserir algo nesta chave.

Como o searchInput é algo que é utilizado em praticamente todos os testes dessa página, optamos por buscar por este item antes do retorno da função, para disponibilizar o elemento sempre que a função é instanciada. Evitando, novamente, duplicação de código, uma vez que não será necessário declarar a variável searchInput em todos os testes que a utiliza.

4.4.3 **E como utilizar este setup?**

Resposta: **Depende**! Esta função é criada conforme a necessidade dos testes. Ou seja: provavelmente mudará de teste para teste. Então fica sob responsabilidade de casa setup ter seu próprio tipo de funcionalidade e retorno. Por isso frisamos novamente aqui: **ISSO É UMA CONVENÇÃO DA EQUIPE.**

No exemplo utilizado acima, poderíamos chamar da seguinte forma:

```jsx
const { getByText, getAllByText, searchInput } = setup({ // AQUI O ESTADO INICIAL DESEJADO })
```

**NOTA: Esta convenção é adotada na documentação do React testing library.**

### Onde escrever os testes e como nomeá-los

Para localizar os testes utilizamos a estrutura padrão adotada pelo próprio React testing library. Em cada pacote onde há a necessidade de escrita de testes, possivelmente haverá um diretório chamado `__tests__` que possuirá uma estrutura de pastas bem semelhante com o que está sendo testado. Recomendamos fortemente a criação deste diretório caso haja a necessidade da criação de testes em pacotes nunca testados.

O nome do arquivo de teste sempre deverá ser IGUAL ao nome do arquivo testado, com o adicional de `.spec` na extensão do mesmo. Veja o exemplo:

Ao testar o arquivo `Home.tsx`, o arquivo de teste deve se chamar `Home.spec.tsx`, indicando que o teste se refere à Home.

### Quando criar mocks

Costumamos ser simples e grossos a respeito disso: **Não é o foco do teste? Mocka!**

Se estamos testando determinada funcionalidade que possui dependências, mas que não são o nosso foco, certamente iremos mocká-la. Um exemplo bem simples disso é quando estamos testando páginas mais complexas, onde há o uso de hooks e funções externas.

**Veja o exemplo abaixo:**

```jsx
jest.mock('~/hooks/useQuery', () => {
  return () => {
    return {
      get: mockedGet
    }
  }
})
```

_Trecho disponível em packages/apps/web/**tests**/pages/Auth/ChangePassword.spec.tsx_

Aqui estamos substituindo o método `get` retornado pelo hook `useQuery` por uma função mockada, fazendo com que possamos fazer asserções em cima dela e impedindo que o escopo de teste vaze para contextos não desejados.
