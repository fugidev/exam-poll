import * as d3 from 'd3'
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

  const [ divRef ] = useState(React.createRef<HTMLDivElement>())

  useEffect(() => {
    // initially focus the bar chart after pressing vote / show results, for screen readers
    if (props.initialFocus) divRef.current.focus()

    const totalCount = Object.values(props.results).reduce(
      (a, b) => a + b,
      0,
    )

    const getBarLabel = (label: string, count: number) => {
      return `${count} ${
        count === 1 ? 'vote' : 'votes'
      } for ${label} (${Math.round((count / totalCount) * 100)} percent)`
    }

    const svg = d3
      .select(divRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('data-chart', 'bar')

    const scale = (d: any) =>
      height * (d / Math.max(...data.map((v) => v[1])))

    const g = svg
      .selectAll('g')
      .data(data.map((v) => v[1]))
      .enter()
      .append('g')
      .attr(
        'transform',
        (d, i) => `translate(${i * (barWidth + margin)}, 0)`,
      )
      .attr('aria-label', (d, i) =>
        getBarLabel(data[i][0], data[i][1]),
      )

    g.append('rect')
      .attr('aria-hidden', true)
      .attr('height', height)
      .attr('width', barWidth)
      .attr('fill', 'transparent')

    const g1 = g
      .append('g')
      .attr('transform', (d) => `translate(0, ${height - scale(d)})`)

    g1.append('rect')
      .attr('aria-hidden', true)
      .attr('height', (d) => scale(d))
      .attr('width', barWidth)
      .attr('fill', '#f7fff7')

    g1.append('text')
      .attr('aria-hidden', true)
      .attr('fill', 'white')
      .attr('alignment-baseline', 'central')
      .attr('dy', '-1em')
      .attr('text-anchor', 'middle')
      .attr('dx', barWidth / 2)
      .attr('transform', (d) => 'translate(' + 0 + ', ' + scale(d) + ')')
      .text((d, i) => data[i][0])

    g1.append('text')
      .attr('aria-hidden', true)
      .attr('fill', 'white')
      .attr('alignment-baseline', 'central')
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .attr('dx', barWidth / 2)
      .text((d, i) => data[i][1])
  }, [])

  return (
    <>
      <style jsx>{`
        div {
          width: 100%;
          max-width: ${width}px;
          margin-bottom: 1rem;
        }
        div :global(svg text) {
          mix-blend-mode: difference;
        }
      `}</style>
      <div ref={divRef} tabIndex={-1}></div>
    </>
  )
}

export default ResultBarChart
