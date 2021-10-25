# Diretrizes de contribuição

## Índice

- [Introdução] (#introdução)
  - [Documentação] (#documentação)
  - [Problemas] (#problemas)
    - [Enviando um problema] (#Enviando-um-problema)
- [Commiting] (#commiting)
  - [Por que todas essas regras?] (# Why-all-these-rules)

##Introdução

Primeiramente, gostaríamos de agradecer a você por dedicar seu tempo para contribuir e tornar este projeto melhor!

Aqui temos um conjunto de instruções e diretrizes para reduzir mal-entendidos e tornar o processo de contribuição para os temas Rocketseat Gatsby o mais suave possível.

Esperamos que este guia torne o processo de contribuição claro e responda a quaisquer perguntas que você possa ter.

### Documentação

Como um usuário de nossos temas, você é o candidato perfeito para nos ajudar a melhorar nossa documentação!

Erros de digitação, falta de exemplos e / ou explicação e assim por diante, são apenas alguns exemplos de coisas que podem ser corrigidas e / ou aprimoradas.

Você pode até fazer melhorias neste guia! :)

Ao documentar, tente manter as coisas simples e claras.

### Problemas

Alguns problemas são criados com informações ausentes, sem um modelo, não reproduzíveis ou simples
inválido.

Você pode torná-los mais fáceis de entender e resolver.

#### Enviando um problema

- Pesquise problemas semelhantes antes de abrir um novo;
- Use um dos modelos de problemas correspondentes;
- Use um título claro e descritivo;
- Inclua o máximo de informações possível, preenchendo o problema fornecido
   modelo;
- Na maioria das vezes, a melhor maneira de relatar um problema é um teste de falha que o comprove.

## Commiting

Uma mensagem de confirmação pode consistir em um **cabeçalho**, **corpo** e **rodapé**. O cabeçalho é a única parte obrigatória e consiste em um tipo e um assunto. O corpo é usado para descrever completamente a mudança. O rodapé é o local para fazer referência a quaisquer problemas ou solicitações de pull relacionados ao commit. Dito isso, terminamos com um modelo como este:

```
<type>: <subject>

[optional body]

[optional footer]
```

Para garantir que um commit seja válido, fácil de ler e pronto para o log de mudanças, temos um gancho que bloqueia a mensagem de commit antes de permitir que um commit passe. Este linter verifica o seguinte:

- O cabeçalho (primeira linha) é a única parte obrigatória da mensagem de confirmação;
- O corpo e o rodapé são opcionais, mas seu uso é altamente recomendado;
- O cabeçalho deve conter:
  - Um tipo:
    - Deve ser minúsculo;
    - Deve ser um dos seguintes:
      - **chore**: Uma mudança que não corrige um bug nem adiciona um recurso;
      - **ci**: Uma mudança de IC;
      - **docs**: uma alteração ou correção na documentação;
      - **feat**: um novo recurso;
      - **fix**: uma correção de bug;
      - **test**: Uma mudança relacionada ao teste.
  - Um assunto:
    - Deve estar em letras maiúsculas;
    - Deve ser limitado a 50 caracteres ou menos;
    - Deve omitir qualquer pontuação final.
- O corpo:
  - Deve ter uma linha em branco inicial;
  - Cada linha deve ser limitada a 72 caracteres ou menos.
- O rodapé:
  - Deve ter uma linha em branco inicial;
  - Cada linha deve ser limitada a 72 caracteres ou menos;
  - Se o seu commit é sobre documentação ou arquivos meta, por favor adicione a tag **[skip ci]** para pular o processo de construção.
  - Se necessário, a referência a problemas e solicitações pull deve ser feita aqui na última linha.

Você também deve seguir estas diretrizes gerais ao se comprometer:

- Use o tempo presente ("Adicionar recurso" e não "Recurso adicionado");
- Use o modo imperativo ("Mover o cursor para ..." e não "Move o cursor para ...");
- Tente responder às seguintes perguntas:
  - Por que essa mudança é necessária?
  - Como aborda o problema?
  - Que efeitos colaterais (se houver) essa alteração pode ter?

Exemplo de uma mensagem de confirmação:

```
  tipo: guia de estilo de mensagem de confirmação para Git

  A primeira linha de uma mensagem de confirmação serve como um resumo. Quando exibido
  na web, muitas vezes é estilizado como um título, e em e-mails, é
  normalmente usado como assunto. Como tal, você deve especificar um "tipo" e
  um assunto". O tipo deve ser minúsculo e um dos seguintes: chore, ci, docs,
  façanha, correção, teste. Para o assunto, você precisará capitalizar e
  omita qualquer pontuação final. Apontar para cerca de 50 caracteres, dar ou
  tomar, caso contrário, pode ser dolorosamente truncado em alguns contextos. Escrever
  isso, junto com o resto da sua mensagem, no tempo presente e
  modo imperativo: "Corrigir bug" e não "Corrigir bug" ou "Corrigir bug".
  O texto consistente torna mais fácil processar mentalmente uma lista de
  compromete.

  Muitas vezes, um assunto por si só é suficiente. Quando não estiver, adicione um
  linha em branco (isso é importante) seguida por um ou mais parágrafos difíceis
  envolto em 72 caracteres. Git é fortemente opinativo de que o autor
  é responsável pelas quebras de linha; se você omiti-los, ferramentas de linha de comando
  irá mostrá-lo como uma linha desembrulhada extremamente longa. Felizmente, a maioria
  editores de texto são capazes de automatizar isso.

  Problemas e solicitações pull podem ser referenciados no rodapé: # 3 # 12
```
