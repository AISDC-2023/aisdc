import clsx from 'clsx'

export function Heading({ headerType, className, ...props }) {
  switch (headerType) {
    case 'h1':
      className = clsx(
        'text-5xl font-bold tracking-tighter text-blue-600',
        className
      )
      return <h1 className={className} {...props} />
    case 'h2':
      className = clsx(
        'text-3xl font-bold tracking-tight text-blue-600',
        className
      )
      return <h2 className={className} {...props} />
    case 'h3':
      className = clsx(
        'text-2xl font-bold tracking-tight text-blue-600',
        className
      )
      return <h3 className={className} {...props} />
    case 'h4':
      className = clsx(
        'text-lg semi-bold tracking-tight text-blue-600',
        className
      )
      return <h4 className={className} {...props} />
  }
}
