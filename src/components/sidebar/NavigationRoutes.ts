export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
      children: [
        {
          name: 'quotas',
          displayName: 'menu.sales-quotas',
        },
        {
          name: 'client-basic-info',
          displayName: 'menu.sales-inquiry',
        },
        {
          name: 'sales-confirmation',
          displayName: 'menu.sales-confirmation',
        },

        {
          name: 'sales-calendar',
          displayName: 'menu.sales-calendar',
        },

        // {
        //   name: 'client-companion',
        //   displayName: 'menu.client-companion',
        // },
        // {
        //   name: 'client-docs',
        //   displayName: 'menu.client-docs',
        // },
      ],
    },

    {
      name: 'module-settings',
      displayName: 'menu.module-settings',
      meta: {
        icon: 'settings',
      },
      children: [
        {
          name: 'qoutas-settings',
          displayName: 'menu.settings-qoutas',
        },
      ],
    },
    // {
    //   name: 'users',
    //   displayName: 'menu.users',
    //   meta: {
    //     icon: 'group',
    //   },
    // },
    // {
    //   name: 'projects',
    //   displayName: 'menu.projects',
    //   meta: {
    //     icon: 'folder_shared',
    //   },
    // },
    // {
    //   name: 'payments',
    //   displayName: 'menu.payments',
    //   meta: {
    //     icon: 'credit_card',
    //   },
    //   children: [
    //     {
    //       name: 'payment-methods',
    //       displayName: 'menu.payment-methods',
    //     },
    //     {
    //       name: 'pricing-plans',
    //       displayName: 'menu.pricing-plans',
    //     },
    //     {
    //       name: 'billing',
    //       displayName: 'menu.billing',
    //     },
    //   ],
    // },
    // {
    //   name: 'auth',
    //   displayName: 'menu.auth',
    //   meta: {
    //     icon: 'login',
    //   },
    //   children: [
    //     {
    //       name: 'login',
    //       displayName: 'menu.login',
    //     },
    //     {
    //       name: 'signup',
    //       displayName: 'menu.signup',
    //     },
    //     {
    //       name: 'recover-password',
    //       displayName: 'menu.recover-password',
    //     },
    //   ],
    // },

    // {
    //   name: 'faq',
    //   displayName: 'menu.faq',
    //   meta: {
    //     icon: 'quiz',
    //   },
    // },
    // {
    //   name: '404',
    //   displayName: 'menu.404',
    //   meta: {
    //     icon: 'vuestic-iconset-files',
    //   },
    // },
    // {
    //   name: 'preferences',
    //   displayName: 'menu.preferences',
    //   meta: {
    //     icon: 'manage_accounts',
    //   },
    // },
    // {
    //   name: 'settings',
    //   displayName: 'menu.settings',
    //   meta: {
    //     icon: 'settings',
    //   },
    // },
  ] as INavigationRoute[],
}
