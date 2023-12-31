import * as d3 from 'd3'
import React, { Component } from 'react'

type ResultBarChartProps = {
  results: {
    [option: string]: number
  }
  initialFocus: boolean
}

class ResultBarChart extends Component<ResultBarChartProps> {
  divRef: React.RefObject<HTMLDivElement>
  data = Object.entries(this.props.results)
  barWidth = 40
  margin = 5
  height = 360
  width = (this.barWidth + this.margin) * this.data.length - this.margin

  constructor(props: ResultBarChartProps) {
    super(props)
    this.divRef = React.createRef<HTMLDivElement>()
  }

  componentDidMount() {
    // initially focus the bar chart after pressing vote / show results, for screen readers
    if (this.props.initialFocus) this.divRef.current.focus()

    const totalCount = Object.values(this.props.results).reduce(
      (a, b) => a + b,
      0,
    )

    const getBarLabel = (label: string, count: number) => {
      return `${count} ${
        count === 1 ? 'vote' : 'votes'
      } for ${label} (${Math.round((count / totalCount) * 100)} percent)`
    }

    const svg = d3
      .select(this.divRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('data-chart', 'bar')

    const scale = (d: any) =>
      this.height * (d / Math.max(...this.data.map((v) => v[1])))

    const g = svg
      .selectAll('g')
      .data(this.data.map((v) => v[1]))
      .enter()
      .append('g')
      .attr(
        'transform',
        (d, i) => `translate(${i * (this.barWidth + this.margin)}, 0)`,
      )
      .attr('aria-label', (d, i) =>
        getBarLabel(this.data[i][0], this.data[i][1]),
      )

    g.append('rect')
      .attr('aria-hidden', true)
      .attr('height', this.height)
      .attr('width', this.barWidth)
      .attr('fill', 'transparent')

    const g1 = g
      .append('g')
      .attr('transform', (d) => `translate(0, ${this.height - scale(d)})`)

    g1.append('rect')
      .attr('aria-hidden', true)
      .attr('height', (d) => scale(d))
      .attr('width', this.barWidth)
      .attr('fill', '#f7fff7')

    g1.append('text')
      .attr('aria-hidden', true)
      .attr('fill', 'white')
      .attr('alignment-baseline', 'central')
      .attr('dy', '-1em')
      .attr('text-anchor', 'middle')
      .attr('dx', this.barWidth / 2)
      .attr('transform', (d) => 'translate(' + 0 + ', ' + scale(d) + ')')
      .text((d, i) => this.data[i][0])

    g1.append('text')
      .attr('aria-hidden', true)
      .attr('fill', 'white')
      .attr('alignment-baseline', 'central')
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .attr('dx', this.barWidth / 2)
      .text((d, i) => this.data[i][1])
  }

  render() {
    return (
      <>
        <style jsx>{`
          div {
            width: 100%;
            max-width: ${this.width}px;
            margin-bottom: 1rem;
          }
          div :global(svg text) {
            mix-blend-mode: difference;
          }
        `}</style>
        <div ref={this.divRef} tabIndex={-1}></div>
      </>
    )
  }
}

export default ResultBarChart
