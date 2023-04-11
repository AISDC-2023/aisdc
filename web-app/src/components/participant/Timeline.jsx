import { Heading } from '@/components/Heading'
import {
  CheckIcon,
  ArrowPathRoundedSquareIcon,
  CloudIcon,
  GiftIcon,
} from '@heroicons/react/20/solid'

export function Timeline({ title, timeline }) {
  const eventTypes = {
    applied: { icon: CloudIcon, bgColorClass: 'bg-gray-400' },
    redeemed: { icon: ArrowPathRoundedSquareIcon, bgColorClass: 'bg-blue-500' },
    completed: { icon: CheckIcon, bgColorClass: 'bg-green-500' },
    redeemed: { icon: GiftIcon, bgColorClass: 'bg-orange-600' },
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const EventTypeIcon = ({ type }) => {
    const Icon = eventTypes[type].icon
    return (
      <>
        <div>
          <span
            className={classNames(
              eventTypes[type].bgColorClass,
              'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white'
            )}
          >
            <Icon className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
        </div>
      </>
    )
  }

  return (
    <section aria-labelledby="timeline-title">
      <div className="rounded-2xl bg-white px-4 py-5 shadow sm:px-6">
        <Heading id="timeline-title" headerType="h3">
          {title}
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
                    <EventTypeIcon type={item.type}></EventTypeIcon>
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
