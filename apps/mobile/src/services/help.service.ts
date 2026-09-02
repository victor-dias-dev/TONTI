import type { HelpTopic } from '../domain';

const topics: HelpTopic[] = [
  {
    id: 'start',
    title: 'Primeiros passos',
    icon: 'rocket',
    articles: [
      {
        id: 'create-account',
        title: 'Como criar uma conta',
        body: 'Abra o Tonti, toque em Criar conta e informe nome, e-mail e senha. Depois confirme o e-mail para começar a organizar suas finanças.',
      },
      {
        id: 'identity',
        title: 'Verificando sua identidade',
        body: 'A verificação de identidade protege sua conta. Envie um documento com foto quando o Tonti solicitar; o processo costuma levar poucos minutos.',
      },
      {
        id: 'security',
        title: 'Segurança no Tonti',
        body: 'Usamos senha criptografada, sessão com token e conexão segura. Nunca compartilhe sua senha e ative as notificações de acesso.',
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Transações',
    icon: 'sync',
    articles: [
      {
        id: 'transfer',
        title: 'Como fazer uma transferência',
        body: 'No Tonti você registra transferências entre contas para manter o saldo certo. Escolha Transferência ao lançar uma nova transação.',
      },
      {
        id: 'limits',
        title: 'Limites de PIX e TED',
        body: 'Limites de PIX e TED vêm do seu banco. O Tonti apenas organiza os lançamentos depois que o dinheiro sai ou entra na conta.',
      },
      {
        id: 'refund',
        title: 'Estorno de pagamentos',
        body: 'Se um pagamento voltar, lance o estorno como receita na mesma categoria ou edite a transação original para manter o extrato fiel.',
      },
    ],
  },
  {
    id: 'planning',
    title: 'Planejamento',
    icon: 'planning',
    articles: [
      {
        id: 'goals',
        title: 'Criando metas financeiras',
        body: 'No planejamento você define quanto quer gastar por categoria. Acompanhe o progresso no gráfico e ajuste o orçamento quando precisar.',
      },
      {
        id: 'charts',
        title: 'Entendendo seus gráficos',
        body: 'As barras e o progresso mostram o quanto já foi usado do planejado. Verde segue no limite; amarelo e vermelho pedem atenção.',
      },
      {
        id: 'categorize',
        title: 'Categorização de gastos',
        body: 'Toda transação precisa de uma categoria. Assim o Tonti agrupa alimentação, moradia e o restante para o orçamento fazer sentido.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Conta',
    icon: 'user',
    articles: [
      {
        id: 'password',
        title: 'Alterar senha e PIN',
        body: 'Abra Perfil e toque em Alterar senha. Use uma senha longa e exclusiva. O PIN do dispositivo fica nas configurações do celular.',
      },
      {
        id: 'data',
        title: 'Atualizar dados cadastrais',
        body: 'Em Perfil, toque em Editar perfil para atualizar seu nome. O e-mail da conta não muda nesta versão.',
      },
      {
        id: 'close',
        title: 'Encerramento de conta',
        body: 'O encerramento remove o acesso ao Tonti. Em Preferências, use Excluir conta quando quiser seguir com o pedido.',
      },
    ],
  },
];

export const helpService = {
  listTopics(): Promise<HelpTopic[]> {
    return Promise.resolve(topics);
  },
};
