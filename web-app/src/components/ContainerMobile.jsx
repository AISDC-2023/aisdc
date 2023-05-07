export function ContainerMobile(props) {
  return (
    <div className="flex min-h-full">
      <div className="mx-auto flex flex-1 flex-col justify-center px-4 py-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96" {...props}></div>
      </div>
    </div>
  )
}
