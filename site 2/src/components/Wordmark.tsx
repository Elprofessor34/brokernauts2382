export function Wordmark({ className = "" }: { className?: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/wordmark.svg"
      alt="Broker-nauts"
      className={`pixel select-none ${className}`}
    />
  );
}
