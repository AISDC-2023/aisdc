import { Paragraph } from '@/components/Paragraph'
import { Heading } from '@/components/Heading'
import {
  CircleStackIcon,
  SquaresPlusIcon,
} from '@heroicons/react/20/solid'

const statuses = {
  true: { icon: CircleStackIcon, bgColorClass: 'bg-green-600' },
  false: { icon: SquaresPlusIcon, bgColorClass: 'bg-orange-600' }
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const EventTypeIcon = ({ qty }) => {
    const type = qty > 0 ? 'true' : 'false'
    const Icon = statuses[type].icon
    return (
      <>
        <div>
          <span
            className={classNames(
              statuses[type].bgColorClass,
              'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white'
            )}
          >
            <Icon className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
        </div>
      </>
    )
}

export function Prizes({ title, list }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-5 shadow sm:px-6">
      <Heading id="timeline-title" headerType="h3">
        {title}
      </Heading>
      {/* Activity Feed */}
      <div className="mt-6 flow-root">
        <ul role="list">
          {list.length > 0 ? (
              list.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <div className="relative pb-8">
                    <div className="relative flex space-x-3">
                      {item ? (
                        <EventTypeIcon qty={item.quantity}></EventTypeIcon>
                      ) : null}
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <Paragraph className="font-medium text-gray-900">
                            {item.name}
                          </Paragraph>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="mb-8 text-center">No prizes yet.</p>
            )}
        </ul>
      </div>
    </div>
  )
}
