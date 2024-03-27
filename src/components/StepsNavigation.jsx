
  
  export default function StepsNavigation({steps}) {
    return (
        <nav aria-label="Progress" className="w-full">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step) => (
            <li key={step.id} className="md:flex-1">
              {step.status === 'complete' ? (
                <a
                  href={step.href}
                  className="flex flex-col py-2 pl-4 border-l-4 border-indigo-600 group hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                >
                  <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">{step.name}</span>

                </a>
              ) : step.status === 'current' ? (
                <a
                  href={step.href}
                  className="flex flex-col py-2 pl-4 border-l-4 border-indigo-600 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-indigo-600">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </a>
              ) : (
                <a
                  href={step.href}
                  className="flex flex-col py-2 pl-4 border-l-4 border-gray-200 group hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                >
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  };
  
