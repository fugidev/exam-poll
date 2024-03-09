import React, { useEffect, useState } from 'react'

type ResultBarChartProps = {
  results: {
    [option: string]: number
  }
  initialFocus: boolean
}

const ResultBarChart: React.FC<ResultBarChartProps> = (props) => {
  const data = Object.entries(props.results)
  const barWidth = 40
  const margin = 5
  const height = 360
  const width = (barWidth + margin) * data.length - margin
  const totalCount = Object.values(props.results).reduce((a, b) => a + b, 0)

  const [svgRef] = useState(React.createRef<SVGSVGElement>())

  const getBarLabel = (label: string, count: number) => {
    const votesString = count === 1 ? 'vote' : 'votes'
    const percent = Math.round((count / totalCount) * 100)

    return `${count} ${votesString} for ${label} (${percent} percent)`
  }

  const getBarHeight = (gradeCount: number) => {
    return height * (gradeCount / Math.max(...Object.values(props.results)))
  }

  useEffect(() => {
    // initially focus the bar chart after pressing vote / show results, for screen readers
    if (props.initialFocus) svgRef.current.focus()
  }, [])

  return (
    <svg
      ref={svgRef}
      tabIndex={-1}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        marginBottom: '1rem',
      }}
    >
      {data.map(([grade, gradeCount], i) => (
        <g
          key={grade}
          transform={`translate(${i * (barWidth + margin)}, 0)`}
          aria-label={getBarLabel(grade, gradeCount)}
        >
          <rect
            aria-hidden
            height={height}
            width={barWidth}
            fill="transparent"
          />
          <g transform={`translate(0, ${height - getBarHeight(gradeCount)})`}>
            <rect
              aria-hidden
              height={getBarHeight(gradeCount)}
              width={barWidth}
              fill="#f7fff7"
            />
            <text
              aria-hidden
              fill="white"
              style={{ mixBlendMode: 'difference' }}
              alignmentBaseline="central"
              textAnchor="middle"
              dy="-1em"
              dx={barWidth / 2}
              transform={`translate(0, ${getBarHeight(gradeCount)})`}
            >
              {grade}
            </text>
            <text
              aria-hidden
              fill="white"
              style={{ mixBlendMode: 'difference' }}
              alignmentBaseline="central"
              textAnchor="middle"
              dy="1em"
              dx={barWidth / 2}
            >
              {gradeCount}
            </text>
          </g>
        </g>
      ))}
    </svg>
  )
}

export default ResultBarChart
