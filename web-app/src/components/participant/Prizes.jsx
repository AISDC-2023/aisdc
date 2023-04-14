import { Paragraph } from '@/components/Paragraph'
import { Heading } from '@/components/Heading'

const statuses = {
  true: 'text-green-400 bg-green-400/10',
  false: 'text-red-400 bg-red-400/10',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Prizes({title, list}) {
  return (
    <div className="rounded-2xl bg-white px-4 py-5 shadow sm:px-6">
        <Heading id="timeline-title" headerType="h3">
          {title}
        </Heading>
        {/* Activity Feed */}
        <div className="mt-6 flow-root">
        <ul role="list">
          {list.map((item) => (
            <li key={item.id} className="relative flex items-center space-x-3">
              <div className="min-w-0 flex-auto">
                <div className="flex items-center gap-x-3">
                  <div className={classNames(statuses[item.available], 'flex-none rounded-full p-1')}>
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <Paragraph className="font-semibold">
                      {item.name}
                  </Paragraph>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
