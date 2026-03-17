import { tv } from 'tailwind-variants';

// TODO: action 에서 하이드레이션 오류

export const button = tv({
  slots: {
    container: 'flex items-center justify-center rounded-2xl',
    label: 'font-semibold',
    indicator: 'text-white',
  },
  variants: {
    color: {
      primary: {
        container: 'bg-primary',
        label: 'text-white',
        indicator: 'text-white',
      },
      secondary: {
        container: 'bg-page border border-solid',
        label: 'text-body',
        indicator: 'text-body',
      },
      destructive: {
        container: 'bg-destructive',
        label: 'text-white',
        indicator: 'text-white',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-body underline',
        indicator: 'text-body',
      },
    },
    size: {
      default: {
        container: 'py-4',
      },
      sm: {
        container: 'py-3',
      },
      lg: {
        container: 'py-5',
      },
    },
    disabled: {
      true: {
        container: 'opacity-40',
      },
    },
    fullWidth: {
      true: {
        container: 'self-stretch',
      },
      false: {
        container: '',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'default',
    disabled: false,
    fullWidth: true,
  },
});

