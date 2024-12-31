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
    },
    {
      name: 'sales',
      displayName: 'menu.sales',
      meta: {
        icon: 'real_estate_agent',
      },
      children: [
        {
          name: 'price-list',
          meta: {
            icon: 'sell',
          },
          displayName: 'menu.price-list',
        },
        {
          name: 'quotas',
          meta: {
            icon: 'star_half',
          },

          displayName: 'menu.sales-quotas',
        },
        {
          name: 'sales-inquiry',
          meta: {
            icon: 'live_help',
          },

          displayName: 'menu.sales-inquiry',
        },
        {
          name: 'sales-confirmation',
          meta: {
            icon: 'check_circle',
          },

          displayName: 'menu.sales-confirmation',
        },

        {
          name: 'sales-calendar',
          meta: {
            icon: 'calendar_month',
          },

          displayName: 'menu.sales-calendar',
        },
        {
          name: 'sales-contracts',
          meta: {
            icon: 'verified',
          },

          displayName: 'menu.sales-contracts',
        },

        // sales-contract-permit
      ],
    },
    {
      name: 'operations',
      displayName: 'menu.operations',
      meta: {
        icon: 'group_work',
      },
      children: [
        {
          name: 'hunting-license',
          meta: {
            icon: 'workspace_premium',
          },

          displayName: 'menu.hunting-license',
        },

        {
          name: 'game',
          meta: {
            icon: 'pets',
          },

          displayName: 'menu.game-killed',
        },

        // game-requitions
        {
          name: 'game-requitions',
          meta: {
            icon: 'outgoing_mail',
          },
          displayName: 'menu.game-requitions',
        },
      ],
    },

    {
      name: 'accounts',
      displayName: 'menu.accounts',
      meta: {
        icon: 'monetization_on',
      },
      children: [
        // {
        //   name: 'hunting-license',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.hunting-license',
        // },
        // {
        //   name: 'game',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.game-killed',
        // },
      ],
    },

    {
      name: 'procurements',
      displayName: 'menu.procurements',
      meta: {
        icon: 'storefront',
      },
      children: [
        // {
        //   name: 'hunting-license',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.hunting-license',
        // },
        // {
        //   name: 'game',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.game-killed',
        // },
      ],
    },

    {
      name: 'hr',
      displayName: 'menu.hr',
      meta: {
        icon: 'supervisor_account',
      },
      children: [
        // {
        //   name: 'hunting-license',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.hunting-license',
        // },
        // {
        //   name: 'game',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.game-killed',
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
          name: 'area-settings',
          meta: {
            icon: 'area_chart',
          },

          displayName: 'menu.settings-area',
        },
        {
          name: 'species-settings',
          meta: {
            icon: 'cruelty_free',
          },

          displayName: 'menu.settings-species',
        },
        {
          name: 'qoutas-settings',
          meta: {
            icon: 'star_half',
          },

          displayName: 'menu.settings-qoutas',
        },
        // regulatory-package
        {
          name: 'regulatory-package',
          meta: {
            icon: 'local_police',
          },

          displayName: 'menu.regulatory-package',
        },

        // sales-package
        {
          name: 'sales-package',
          meta: {
            icon: 'inventory_2',
          },

          displayName: 'menu.sales-package',
        },

        {
          // sales-extra-services
          name: 'sales-extra-services',
          meta: {
            icon: 'browse_gallery',
          },
          displayName: 'menu.sales-extra-services',
        },

        // price-list
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
