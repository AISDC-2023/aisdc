import clsx from 'clsx'

export function Input({ className, ...props }) {
  const handleChange = (event) => {
    props.onChange(event.target.value)
  }

  className = clsx(
    'block w-full rounded-2xl border-0 p-4 leading-6 shadow-sm ring-1 ring-inset ring-blue-300 placeholder:text-blue-400 focus:ring-2 focus:ring-inset focus:ring-blue-600',
    className
  )

  return (
    <div>
      <label
        htmlFor={props.id}
        className="block font-medium leading-6 text-blue-900"
      >
        {props.label}
      </label>
      <div className="mt-2">
        <input
          id={props.id}
          name={props.id}
          type={props.type}
          value={props.value}
          required={props.required}
          onChange={handleChange}
          className={className}
          disabled={props.disabled}
        />
      </div>
    </div>
  )
}
