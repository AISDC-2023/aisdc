export function ContainerAdmin(props) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-12" {...props}>
          {props.children}
        </div>
      </div>
    );
  }
  