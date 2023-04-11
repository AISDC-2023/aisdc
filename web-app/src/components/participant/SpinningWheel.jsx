import { useState, useRef } from 'react'
import { Button } from '@/components/Button'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Chart as ChartJS, ArcElement } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(ArcElement, ChartDataLabels)

const prizes = [
  {
    pid: 4,
    name: 'Lightstick',
    quantity: 12,
    probability: 0.2,
  },
  {
    pid: 5,
    name: 'Lightsticv10k',
    quantity: 12,
    probability: 0.4,
  },
  {
    pid: 8,
    name: 'Lightsticv10k',
    quantity: 12,
    probability: 0.4,
  },
  {
    pid: 400,
    name: 'DDLightstick',
    quantity: 0,
    probability: 0.1,
  },
  {
    pid: 9,
    name: 'Lightsticv10k',
    quantity: 12,
    probability: 0.4,
  },
]

// Call an external API endpoint to get prizes
//   fetch('https://random-data-api.com/api/v2/users?size=1')
//     .then(() => {

//     })
//     .catch(() => {
//       // dont do anything
//     })

export const data = {
  labels: prizes.map((prize) => prize.name),
  datasets: [
    {
      label: 'Prizes',
      data: prizes.map((prize) => prize.probability),
      backgroundColor: '#F2682B',
      borderColor: '#487093',
      borderWidth: 5,
      //   datalabels: {
      //     rotation:
      //   }
    },
  ],
}

// export 

// export async function getServerSideProps() {
//     const data = getChartData()
//     return {
//         props: {
//           data
//         },
//       }
// }

export function SpinningWheel() {
    const [text, setText] = useState('Spin Spin Spin!')
    const [spin, setSpin] = useState(false);
    const [degree, setDegree] = useState(0);
    const chartRef = useRef(null);
    const options = {
        responsive: true,
        plugins: {
          datalabels: {
            color: '#fff',
            font: {
              family: 'Poppins',
              size: 15,
            },
            formatter: function (value, context) {
              return context.chart.data.labels[context.dataIndex]
            },
          },
        },
        animation: {
          animateRotate: 'spin',
        }
      }

    const handleSpin = () => {
        setSpin(true);
        setTimeout(() => {
          setSpin(false);
          
          const currentAngle = chartRef.current.chartInstance.options.rotation;
          setDegree(currentAngle);
        }, 5000);
      };

      const newOptions = {
        ...options,
        rotation: degree,
      };

  return (
    <>
      <div className="overflow-hidden">
        { text }
        <Pie
          className="p-5 transition-transform ease-out"
          data={data}
          options={newOptions}
          ref={chartRef}
        />
        <Button
          onClick={handleSpin}
          className="w-full items-center"
          type="button"
        >
          <span>Spin Spin Spin!</span>
          <SparklesIcon className="ml-3 h-6 w-6" />
        </Button>
        <p className="mt-2 text-center text-sm text-blue-600">
          <span className="inline-flex items-center">
            <InformationCircleIcon className="mr-2 h-5 w-5" />1 spin = 5 stamps
          </span>
        </p>
      </div>
    </>
  )
}
