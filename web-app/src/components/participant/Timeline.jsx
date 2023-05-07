import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'
import {
  CheckIcon,
  ComputerDesktopIcon,
  GiftIcon,
} from '@heroicons/react/20/solid'

export function Timeline({ title, list }) {
  const eventTypes = {
    stamp: { icon: CheckIcon, bgColorClass: 'bg-green-500' },
    prize: { icon: GiftIcon, bgColorClass: 'bg-orange-600' },
    workshop: { icon: ComputerDesktopIcon, bgColorClass: 'bg-blue-600' },
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const EventTypeIcon = ({ type }) => {
    if (eventTypes[type] !== undefined) {
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
    } else {
      return null
    }
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
            {list.length > 0 ? (
              list.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <div className="relative pb-8">
                    {itemIdx !== list.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      {item ? (
                        <EventTypeIcon type={item.type}></EventTypeIcon>
                      ) : null}
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <Paragraph className="font-medium text-gray-900">
                            {item.description}
                          </Paragraph>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime={item.datetime}>{item.date}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="mb-8 text-center">No activity yet.</p>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
