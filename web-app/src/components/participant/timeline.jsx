import { CheckIcon, ArrowPathRoundedSquareIcon, CloudIcon } from '@heroicons/react/20/solid'
import { Heading } from '@/components/Heading'

export function Timeline() {
  const eventTypes = {
    applied: { icon: CloudIcon, bgColorClass: 'bg-gray-400' },
    redeemed: { icon: ArrowPathRoundedSquareIcon, bgColorClass: 'bg-blue-500' },
    completed: { icon: CheckIcon, bgColorClass: 'bg-green-500' },
  }

  const timeline = [
    {
      id: 1,
      type: eventTypes.applied,
      content: 'Applied to',
      target: 'Front End Developer',
      date: 'Sep 20',
      datetime: '2020-09-20',
    },
    {
      id: 2,
      type: eventTypes.redeemed,
      content: 'redeemed to phone screening by',
      target: 'Bethany Blake',
      date: 'Sep 22',
      datetime: '2020-09-22',
    },
    {
      id: 3,
      type: eventTypes.completed,
      content: 'Completed phone screening with',
      target: 'Martha Gardner',
      date: 'Sep 28',
      datetime: '2020-09-28',
    },
    {
      id: 4,
      type: eventTypes.redeemed,
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 40,
      type: eventTypes.redeemed,
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 674,
      type: eventTypes.redeemed,
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 5674,
      type: eventTypes.redeemed,
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 5764,
      type: eventTypes.redeemed,
      content: 'redeemed to interview by',
      target: 'Bethany Blake',
      date: 'Sep 30',
      datetime: '2020-09-30',
    },
    {
      id: 5,
      type: eventTypes.completed,
      content: 'Completed interview with',
      target: 'Katherine Snyder',
      date: 'Oct 4',
      datetime: '2020-10-04',
    },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <section aria-labelledby="timeline-title">
      <div className="rounded-2xl bg-white px-4 py-5 shadow sm:px-6">
        <Heading id="timeline-title" headerType="h3">
            YOUR ACTIVITY
        </Heading>
           {/* Activity Feed */}
        <div className="mt-6 flow-root">
          <ul role="list" className="-mb-8">
            {timeline.map((item, itemIdx) => (
              <li key={item.id}>
                <div className="relative pb-8">
                  {itemIdx !== timeline.length - 1 ? (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={classNames(
                          item.type.bgColorClass,
                          'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white'
                        )}
                      >
                        <item.type.icon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">
                          {item.content}{' '}
                          <a href="#" className="font-medium text-gray-900">
                            {item.target}
                          </a>
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={item.datetime}>{item.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
