import Link from 'next/link'
import React from 'react'

const Box = (props) => {
  const content = (
    <div className="flex items-center justify-between w-full h-full relative z-10 transition-all duration-500">
      <div className='info flex-1 flex flex-col justify-between'>
        <h5 className='text-white/70 text-[11px] md:text-[13px] font-black uppercase tracking-widest mb-2 leading-none'>{props?.title}</h5>
        <h2 className='text-white text-[24px] md:text-[32px] font-black leading-none tracking-tight'>{props?.count}</h2>
      </div>

      <div className="w-[45px] h-[45px] md:w-[60px] md:h-[60px] rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
        {props?.icon && React.cloneElement(props.icon, { 
            size: 32, 
            className: "text-white/90 !w-[22px] !h-[22px] md:!w-[32px] md:!h-[32px]" 
        })}
      </div>
    </div>
  );

  const classes = `p-6 md:p-8 flex items-center gap-6 rounded-[32px] ${props?.bg} relative overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-${props?.bg?.split('-')[1]}/10 group min-h-[140px] border border-white/5`;

  return (
    <>
      {props?.link ? (
        <Link href={props?.link} className={classes}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          {content}
        </Link>
      ) : (
        <div className={classes}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          {content}
        </div>
      )}
    </>
  )
}

export default Box