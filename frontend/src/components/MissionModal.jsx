import { useEffect, useState } from "react";
import { playError, playSuccess } from "../lib/sound.js";

export default function MissionModal({
  mission,
  onSubmit,
  result,
  submitting,
  children,
}) {

  const [answer,setAnswer] = useState("");
  const [hintShown,setHintShown] = useState(false);


  useEffect(()=>{

    if(!result) return;

    result.correct
      ? playSuccess()
      : playError();

  },[result]);



  function handleSubmit(e){

    e.preventDefault();

    if(!answer.trim() || submitting) return;

    onSubmit(answer);

  }



  return (

    <div
      className="
      w-full
      max-w-[1600px]
      mx-auto
      overflow-hidden
      border-[3px]
      border-black
      bg-[#20252b]
      shadow-[6px_6px_0_0_#000]
      "
    >


      {/* TASK HEADER */}

      <div
        className="
        flex
        items-center
        justify-between
        border-b-[3px]
        border-black
        bg-white
        px-5
        py-4
        "
      >

        <div>

          <span
            className="
            inline-block
            border-[2px]
            border-black
            bg-black
            px-2
            py-0.5
            font-mono
            text-[10px]
            font-bold
            uppercase
            tracking-widest
            text-white
            "
          >
            {mission.room}
          </span>


          <h1
            className="
            mt-2
            font-display
            text-2xl
            font-black
            uppercase
            tracking-wide
            text-black
            "
          >
            {mission.title}
          </h1>


        </div>


      </div>



      {/* TASK BODY */}

      <div
        className="
        bg-[#171b20]
        p-5
        "
      >


        <div
          className="
          border-[3px]
          border-black
          bg-[#2E6BFF]
          p-4
          font-body
          text-sm
          text-black
          shadow-[3px_3px_0_0_#000]
          "
        >

          {mission.prompt}

        </div>



        {mission.hint && (

          <div className="mt-4">

            <button

              onClick={()=>setHintShown(!hintShown)}

              className="
              border-[3px]
              border-black
              bg-[#FFC24B]
              px-4
              py-2
              font-display
              text-xs
              font-black
              uppercase
              tracking-wide
              text-black
              shadow-[3px_3px_0_0_#000]
              transition-transform
              hover:scale-[1.02]
              active:translate-y-[1px]
              active:shadow-none
              "

            >

              {hintShown ? "Hide Hint" : "Hint"}

            </button>



            {hintShown && (

              <div
                className="
                mt-3
                border-[3px]
                border-black
                bg-[#FFC24B]
                p-3
                font-mono
                text-sm
                text-black
                shadow-[3px_3px_0_0_#000]
                "
              >

                {mission.hint}

              </div>

            )}

          </div>

        )}





        {/* PUZZLE AREA */}

        <div
          className="
          mt-5
          border
          border-[#414954]
          bg-[#090c10]
          p-4
          "
        >

          {children}

        </div>





        {/* SUBMIT */}

        <form

          onSubmit={handleSubmit}

          className="
          mt-5
          flex
          gap-3
          "

        >

          <input

            value={answer}

            onChange={(e)=>setAnswer(e.target.value)}

            placeholder={mission.id === "laboratory" ? "ENTER BIRTH YEAR" : "ENTER FLAG"}

            className="
            flex-1
            border-[3px]
            border-black
            bg-white
            px-4
            py-3
            font-mono
            text-black
            placeholder:text-black/40
            outline-none
            "

          />


          <button

            disabled={submitting}

            className="
            border-[3px]
            border-black
            bg-[#FF3C32]
            px-7
            font-display
            text-sm
            font-black
            uppercase
            tracking-wide
            text-black
            shadow-[3px_3px_0_0_#000]
            transition-transform
            hover:scale-[1.02]
            active:translate-y-[2px]
            active:shadow-none
            disabled:opacity-50
            "

          >

            {submitting ? "CHECKING" : "SUBMIT"}

          </button>


        </form>





        {result && (

          <div

          className={`
          mt-4
          flex
          items-start
          gap-3
          border-[3px]
          border-black
          p-4
          shadow-[4px_4px_0_0_#000]

          ${
            result.correct
            ?
            "bg-[#8CFF98] text-black"
            :
            "bg-[#FF3C32] text-black"
          }

          `}

          >

            <span
              className="
              shrink-0
              font-display
              text-xs
              font-black
              uppercase
              tracking-widest
              "
            >
              {result.correct ? "Cleared" : "Not cleared"}
            </span>

            <span className="font-mono text-sm">
              {result.message}
            </span>

          </div>

        )}



      </div>


    </div>

  );

}
