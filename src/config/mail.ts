interface IMailConfig {
  provider: 'ethereal' | 'ses';
  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  provider: process.env.APP_MAIL_PROVIDER || 'ethereal',
  defaults: {
    from: {
      name: 'João Cavendish',
      email: 'me@cavendish.dev',
    },
  },
} as IMailConfig;
