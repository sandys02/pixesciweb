import * as React from "react"

export function BrandName() {
  return (
    <span className="whitespace-nowrap">
      PixeSci
      <sup className="ml-0.5 align-super text-[0.55em] leading-none tracking-normal">
        TM
      </sup>
    </span>
  )
}

export function TrademarkText({ text }: { text: string }) {
  const parts = text.split("PixeSci")

  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={`${part}-${index}`}>
          {index > 0 ? <BrandName /> : null}
          {part}
        </React.Fragment>
      ))}
    </>
  )
}
