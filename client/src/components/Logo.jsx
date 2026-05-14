export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="#6ec1ff" 
        className="w-12 h-12"
      >
        <path d="M12 2a5 5 0 0 0-3 9.13V14H7v1h3v2a3 3 0 1 0 6 0v-1h-2v-3h1v-2H9v-2.87A5 5 0 1 0 12 2z"/>
      </svg>
      <div className="flex flex-col">
        <h1 className="font-bold text-xl text-[#6ec1ff] leading-tight m-0">
          LACITA AI EDU
        </h1>
        <p className="font-medium text-sm text-[#7bb1e5] m-0">
          RIAU LEARNING
        </p>
      </div>
    </div>
  )
}