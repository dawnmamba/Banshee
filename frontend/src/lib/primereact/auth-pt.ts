export const labelClass =
  'mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300';

export const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50';

export const linkClass =
  'text-base font-medium text-zinc-900 dark:text-zinc-50';

export const linkMutedClass =
  'text-base text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50';

export const headerClass =
  'relative flex min-h-16 items-center justify-end gap-6 border-b border-zinc-200 bg-white px-8 py-4 dark:border-zinc-800 dark:bg-zinc-950';

export const secondaryButtonClass =
  'rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-900';

const buttonClass =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300';

export const logoutButtonPt = {
  root: { className: buttonClass },
  label: { className: 'order-1 text-white dark:text-zinc-900' },
  icon: { className: 'order-2' },
};

export const successClass = 'text-sm text-green-600 dark:text-green-400';

const errorClass = 'text-sm text-red-600 dark:text-red-400';

export const requiredMarkClass = 'text-red-600 dark:text-red-400';

const messageRootClass = 'border-none bg-transparent p-0';

export const successMessagePt = {
  root: { className: messageRootClass },
  text: { className: successClass },
  icon: { className: 'hidden' },
};

export const errorMessagePt = {
  root: { className: messageRootClass },
  text: { className: errorClass },
  icon: { className: 'hidden' },
};

const toggleIconClass =
  'cursor-pointer text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200';

/** Positions toggle icon inside the input (replaces styled-mode .p-icon-field-right). */
const iconFieldClass = 'relative block w-full';

const inputIconClass =
  'absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center';

const passwordInputClass = `${inputClass} pr-10`;

const avatarRootClass =
  'inline-flex items-center justify-center rounded-full border border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300';

export const navAvatarTriggerClass = `${avatarRootClass} h-12 w-12 shrink-0`;

export const navAvatarPanelClass = `${avatarRootClass} h-14 w-14 shrink-0`;

const overlayPanelClass =
  'rounded-lg border border-zinc-300 bg-white shadow-lg dark:border-zinc-600 dark:bg-zinc-950';

const overlayPanelContentClass = 'p-4';

const selectButtonRootClass = 'flex w-full gap-1';

const selectButtonOptionClass =
  'flex flex-1 items-center justify-center rounded-lg border border-zinc-300 bg-white p-2.5 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900';

const selectButtonOptionSelectedClass =
  'flex flex-1 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-900 p-2.5 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900';

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
    root: { className: messageRootClass },
    text: ({ props }: { props: { severity?: string } }) => ({
      className: props.severity === 'success' ? successClass : errorClass,
    }),
    icon: { className: 'hidden' },
  },
  inputtextarea: {
    root: { className: inputClass },
  },
  avatar: {
    root: { className: avatarRootClass },
    icon: { className: 'text-lg' },
  },
  overlaypanel: {
    root: { className: overlayPanelClass },
    content: { className: overlayPanelContentClass },
  },
  selectbutton: {
    root: { className: selectButtonRootClass },
    button: ({ context }: { context: { selected: boolean } }) => ({
      className: context.selected
        ? selectButtonOptionSelectedClass
        : selectButtonOptionClass,
    }),
    label: { className: 'sr-only' },
  },
};
