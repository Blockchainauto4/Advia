import React from 'react';

// --- ICONS ---
export const SparklesIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.863 2.863l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.863 2.863l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.863-2.863l-2.846-.813a.75.75 0 010-1.442l2.846.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a6.75 6.75 0 005.156 5.156l1.036.258a.75.75 0 010 1.456l-1.036.258a6.75 6.75 0 00-5.156 5.156l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a6.75 6.75 0 00-5.156-5.156l-1.036-.258a.75.75 0 010-1.456l1.036.258a6.75 6.75 0 005.156-5.156l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
  </svg>
);
export const TwitterIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.5 20.33 8.79c0-.19 0-.38-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
    </svg>
);
export const LinkedInIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);
export const GoogleIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);
export const FacebookIcon: React.FC<{className: string}> = ({className}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

// --- ICONS for assistants and chat ---
export const CalculatorIcon: React.FC<{className: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M3.75 2.25a.75.75 0 00-1.5 0v1.5A.75.75 0 003 4.5h15A.75.75 0 0018.75 3V2.25a.75.75 0 00-1.5 0v.75H4.5V2.25zM19.5 7.5a.75.75 0 01-.75.75H5.25a.75.75 0 010-1.5h13.5a.75.75 0 01.75.75zM8.25 10.5a.75.75 0 01.75.75v3.375a.75.75 0 01-1.5 0V11.25a.75.75 0 01.75-.75zm3 0a.75.75 0 01.75.75v3.375a.75.75 0 01-1.5 0V11.25a.75.75 0 01.75-.75zm3.75.75a.75.75 0 00-1.5 0v3.375a.75.75 0 001.5 0V11.25zM19.5 17.25a.75.75 0 01-.75.75H5.25a.75.75 0 010-1.5h13.5a.75.75 0 01.75.75zM3 20.25a2.25 2.25 0 012.25-2.25H18.75a2.25 2.25 0 012.25 2.25v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 00-.75-.75H5.25a.75.75 0 00-.75.75v.75a.75.75 0 01-1.5 0v-.75z" clipRule="evenodd" /></svg>;
export const BriefcaseIcon: React.FC<{className: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.75 2.25A2.25 2.25 0 007.5 4.5v1.875c0 .596.223 1.17.62 1.622a2.25 2.25 0 013.76 0c.397-.452.62-1.026.62-1.622V4.5A2.25 2.25 0 009.75 2.25zM8.25 4.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v1.875a.75.75 0 01-3 0V4.5z" clipRule="evenodd" /><path d="M3 9.75A2.25 2.25 0 015.25 7.5h13.5A2.25 2.25 0 0121 9.75v7.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25v-7.5zm1.5-2.25a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75-.75H5.25a.75.75 0 01-.75-.75v-7.5z" /></svg>;
export const ScaleIcon: React.FC<{className: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A11.213 11.213 0 0117.25 8.25c0 4.142-2.33 7.72-5.736 9.531a.75.75 0 00.569 1.366 12.713 12.713 0 006.917-10.9A12.705 12.705 0 0012.963 2.286zM12 1.5A10.5 10.5 0 001.5 12c0 4.903 3.385 9.014 7.963 10.19a.75.75 0 00.77-1.313A8.995 8.995 0 013 12c0-4.963 4.037-9 9-9s9 4.037 9 9a8.995 8.995 0 01-7.233 8.877.75.75 0 00.77 1.313A10.5 10.5 0 0022.5 12 10.5 10.5 0 0012 1.5z" clipRule="evenodd" /><path d="M4.536 8.163a.75.75 0 00-1.071 1.052 6.75 6.75 0 0010.072 7.72.75.75 0 00.569-1.366 5.25 5.25 0 01-7.834-6.002.75.75 0 00-1.736-.404z" /></svg>;
export const GavelIcon: React.FC<{className: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.842-1.203-2.274-1.883-3.78-1.883-2.906 0-4.884 2.386-4.884 5.25 0 2.756 1.673 4.913 4.09 5.576a.75.75 0 00.926-.648 4.12 4.12 0 01-.186-1.317c.01-.143.023-.286.04-.428.106-.867.433-1.693.93-2.438.508-.759 1.259-1.393 2.185-1.782a.75.75 0 00.264-1.332z" clipRule="evenodd" /></svg>;

export const PaperAirplaneIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);
export const UserCircleIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);

export const ChatBubbleLeftRightIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M5.022 15.28a.75.75 0 01.75-.75H18.75a.75.75 0 010 1.5H5.772a.75.75 0 01-.75-.75zM5.022 9.28a.75.75 0 01.75-.75H18.75a.75.75 0 010 1.5H5.772a.75.75 0 01-.75-.75zM3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6zM6 5.25a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h12a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75H6z"></path>
    </svg>
);

export const PlusIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

// FIX: Added missing icons to resolve import errors.
export const TrashIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 01-.749.658h-7.5a.75.75 0 01-.749-.658L5.21 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.347-9zm5.48.058a.75.75 0 10-1.499-.058l-.347 9a.75.75 0 001.5.058l.347-9z" clipRule="evenodd" />
  </svg>
);
export const ClockIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
  </svg>
);
export const DocumentTextIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 2.25c-1.035 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V7.5a4.5 4.5 0 00-4.5-4.5H4.5zm6.75.75h.75a.75.75 0 000-1.5H9a.75.75 0 00-.75.75v1.5c0 .414.336.75.75.75h1.5v-1.5H11.25V3zm-3 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);
export const UsersIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM4.5 16.875a3.375 3.375 0 100-6.75 3.375 3.375 0 000 6.75zM13.5 14.25a5.25 5.25 0 1010.5 0 5.25 5.25 0 00-10.5 0z" />
  </svg>
);
export const ShieldCheckIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 1.5c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 1.5 12 1.5zm3.06 8.22a.75.75 0 00-1.06-1.06L11.25 11.44l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l3.75-3.75z" clipRule="evenodd" />
  </svg>
);
export const CarIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.25 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.75 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.502 12a7.5 7.5 0 0114.996 0H4.502z" clipRule="evenodd" />
  </svg>
);
export const ClipboardIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.5 3A2.25 2.25 0 008.25 5.25v.077a.75.75 0 001.5 0V5.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v.077a.75.75 0 001.5 0V5.25A2.25 2.25 0 0013.5 3h-3zM9 6.653a3.676 3.676 0 01-1.423.775.75.75 0 00-.577 1.432 4.123 4.123 0 003.882 3.193.75.75 0 00.577-1.432 3.676 3.676 0 01-1.423-.775V6.653zm5.077.775a3.676 3.676 0 001.423-.775.75.75 0 00.577-1.432 4.123 4.123 0 01-3.882-3.193.75.75 0 00-.577 1.432 3.676 3.676 0 001.423.775v3.127zM4.5 6.75A2.25 2.25 0 002.25 9v9A2.25 2.25 0 004.5 20.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25H4.5z" clipRule="evenodd" />
  </svg>
);
export const ArrowDownTrayIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);
export const SaveIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 18a6 6 0 100-12 6 6 0 000 12zM12 16.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" clipRule="evenodd" />
  </svg>
);
export const SpeakerWaveIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
  </svg>
);
export const StopIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
  </svg>
);
export const HomeIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.026.026.05.054.07.084v6.101a2.25 2.25 0 01-2.25 2.25H6.012a2.25 2.25 0 01-2.25-2.25v-6.101c.02-.03.044-.058.07-.084L12 5.432z" />
  </svg>
);
export const CheckIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);
export const ArrowRightOnRectangleIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5A1.5 1.5 0 007.5 20.25h8.25a.75.75 0 000-1.5H7.5a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75h8.25a.75.75 0 000-1.5H7.5zM12 11.25a.75.75 0 000 1.5h4.94l-1.72 1.72a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H12z" clipRule="evenodd" />
    </svg>
);
export const ArrowLeftOnRectangleIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.5 3.75A1.5 1.5 0 0118 5.25v13.5A1.5 1.5 0 0116.5 20.25h-8.25a.75.75 0 010-1.5H16.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-8.25a.75.75 0 010-1.5H16.5zM12 11.25a.75.75 0 010 1.5H7.06l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 111.06 1.06L7.06 11.25H12z" clipRule="evenodd" />
    </svg>
);
export const Bars3Icon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
export const XMarkIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
export const CheckCircleIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const XCircleIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
export const CreditCardIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" />
    </svg>
);
export const LockClosedIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25a3.75 3.75 0 017.5 0v3h-7.5v-3z" clipRule="evenodd" />
    </svg>
);
