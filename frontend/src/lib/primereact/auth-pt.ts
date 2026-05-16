export const labelClass =
  'mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300';

export const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50';

const buttonClass =
  'w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300';

const errorClass = 'text-sm text-red-600 dark:text-red-400';

const toggleIconClass =
  'cursor-pointer text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200';

/** Positions toggle icon inside the input (replaces styled-mode .p-icon-field-right). */
const iconFieldClass = 'relative block w-full';

const inputIconClass =
  'absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center';

const passwordInputClass = `${inputClass} pr-10`;

export const authPt = {
  inputtext: {
    root: { className: inputClass },
  },
  iconfield: {
    root: { className: iconFieldClass },
  },
  inputicon: {
    root: { className: inputIconClass },
  },
  password: {
    root: { className: 'w-full' },
    iconField: {
      root: { className: iconFieldClass },
    },
    inputIcon: {
      root: { className: inputIconClass },
    },
    input: {
      root: { className: passwordInputClass },
    },
    showIcon: { className: toggleIconClass },
    hideIcon: { className: toggleIconClass },
  },
  button: {
    root: { className: buttonClass },
    label: {
      className: 'text-white dark:text-zinc-900',
    },
  },
  message: {
    root: { className: 'border-none bg-transparent p-0' },
    text: { className: errorClass },
    icon: { className: 'hidden' },
  },
};
