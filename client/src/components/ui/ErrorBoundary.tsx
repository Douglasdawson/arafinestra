import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const messages: Record<string, { title: string; desc: string; reload: string }> = {
  ca: { title: "Alguna cosa ha anat malament", desc: "S'ha produït un error inesperat.", reload: "Recarregar" },
  es: { title: "Algo ha salido mal", desc: "Se ha producido un error inesperado.", reload: "Recargar" },
  en: { title: "Something went wrong", desc: "An unexpected error occurred.", reload: "Reload" },
};

function getMessages() {
  const lang = (typeof navigator !== "undefined" ? navigator.language : "ca").slice(0, 2);
  return messages[lang] || messages.ca;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const msg = getMessages();
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">
            {msg.title}
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            {msg.desc}
          </p>
          <button
            onClick={this.handleReload}
            className="rounded-lg bg-orange-500 px-6 py-3 text-white font-semibold hover:bg-orange-600 transition-colors"
          >
            {msg.reload}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
