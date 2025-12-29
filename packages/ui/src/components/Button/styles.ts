import { tv } from 'tailwind-variants';

export const button = tv({
  slots: {
    container: 'flex items-center justify-center rounded-md',
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
        label: 'text-xl',
      },
      sm: {
        container: 'py-3',
        label: 'text-base',
      },
      lg: {
        container: 'py-5',
        label: 'text-2xl',
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

