type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <p className="status-message" role="status" aria-live="polite">
      {label}
    </p>
  );
}
