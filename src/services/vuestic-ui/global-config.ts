import iconsConfig from './icons-config/icons-config'
import colors from './themes'
import { defineVuesticConfig } from 'vuestic-ui'

export default defineVuesticConfig({
  colors,
  icons: iconsConfig,
  breakpoint: {
    enabled: true,
    bodyClass: true,
    thresholds: {
      xs: 0,
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1440,
    },
  },
  components: {
    VaIcon: {
      sizesConfig: {
        defaultSize: 19,
        sizes: {
          small: 14,
          medium: 19,
          large: 26,
        },
      },
    },
    VaSelect: {
      searchable: true,
    },
    VaButton: {
      color: 'primary',
      colors: {
        default: 'primary',
        success: 'success',
        danger: 'error',
        warning: 'warning',
        info: 'info',
      },
    },

    VaModal: {
      mobileFullscreen: false,
      maxHeight: 'calc(100% - 2rem)',
    },
    VaPagination: {
      activeButtonProps: {
        preset: 'primary',
      },
    },
    VaDataTable: {
      disableClientSideSorting: false,
      striped: true,
      hoverable: true,
      // selectable: true,
      searchable: true,
      showSelectAll: true,
    },

    VaCard: {
      stripe: true,
      stripeColor: '#5C4033',
    },

    presets: {
      VaSelect: {
        small: {
          class: 'va-select--small',
          keepAnchorWidth: false,
          placement: 'bottom-end',
          width: 'min(100%, 150px)',
          style:
            '--va-input-wrapper-min-height: 24px; --va-input-wrapper-border-radius: 2px; --va-input-wrapper-width: 100px;',
        },
      },
    },
  },
})
