export default function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" className="animate-spin" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="20" strokeWidth="5" stroke="#ffffff33" fill="none" />
      <path d="M45 25a20 20 0 0 1-20 20" strokeWidth="5" stroke="#fff" strokeLinecap="round" fill="none" />
    </svg>
  )
}
