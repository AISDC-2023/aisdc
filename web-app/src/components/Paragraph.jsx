import clsx from 'clsx'

export function Paragraph({ className, ...props }) {
  className = clsx('tracking-tight text-blue-600', className)
  return <p className={className} {...props} />
}
