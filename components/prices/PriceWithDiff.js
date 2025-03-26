import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
export default function PriceWithDiff({ value, diff }) {
	console.log(diff)
	return (
		<NumberFlowGroup>
			<div
				className="flex items-center gap-4 font-semibold"
			>
				<b>
				<NumberFlow
					value={value}
					locales="en-US"
					format={{ style: 'decimal', signDisplay: 'always'}}
					className="~text-2xl/4xl"
					style={value < 0 ? {color: "red"} : {color: "green"}}
				/>	
				</b>
				<br />
				(<NumberFlow
					value={diff}
					locales="en-US"
					format={{ style: 'percent', maximumFractionDigits: 4, signDisplay: 'always' }}
					style={value < 0 ? {color: "red"} : {color: "green"}}
				/>	
				)
				
			</div>
		</NumberFlowGroup>
	)
}