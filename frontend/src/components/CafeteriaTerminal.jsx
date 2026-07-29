import { useRef, useState } from "react";

/* -------------------------
   Crew Terminal Files
------------------------- */

const FS = {

  "/home/crew": {
    type:"dir",
    children:[
      "notes.txt",
      "fridge",
      ".shift_log"
    ],
  },


  "/home/crew/notes.txt":{
    type:"file",
    content:"Remember to restock napkins.",
  },


  "/home/crew/.shift_log":{
    type:"file",
    content:"FLAG{ls_cd_cat_master}",
  },


  "/home/crew/fridge":{
    type:"dir",
    children:[
      "leftovers.txt"
    ],
  },


  "/home/crew/fridge/leftovers.txt":{
    type:"file",
    content:"Do not eat the blue container.",
  },

};


const START_DIR="/home/crew";



/* -------------------------
   Path Resolver
------------------------- */


function resolvePath(cwd,target){

  if(!target || target===".") return cwd;


  if(target===".."){

    const parts=cwd.split("/").filter(Boolean);

    parts.pop();

    return "/" + parts.join("/") || "/";

  }


  if(target.startsWith("/")){

    return target.replace(/\/+$/,"") || "/";

  }


  return `${cwd}/${target}`
    .replace(/\/+/g,"/")
    .replace(/\/$/,"");

}




/* -------------------------
   Component
------------------------- */


export default function CafeteriaTerminal(){

  const scrollRef=useRef(null);
  const inputRef=useRef(null);


  const [cwd,setCwd]=useState(START_DIR);

  const [input,setInput]=useState("");

  const [lines,setLines]=useState([
    "CREW COMPUTER ONLINE",
    "TYPE help FOR COMMANDS",
  ]);




  function print(text){

    setLines(prev=>[
      ...prev,
      text
    ]);


    requestAnimationFrame(()=>{

      scrollRef.current?.scrollTo({

        top:
        scrollRef.current.scrollHeight,

        behavior:"smooth"

      });

    });

  }





  function runCommand(raw){


    const trimmed=raw.trim();


    if(!trimmed) return;


    print(`${cwd} > ${trimmed}`);



    const [cmd,...rest]=trimmed.split(/\s+/);



    const arg=
      rest
      .filter(x=>!x.startsWith("-"))
      .join(" ");



    const showHidden=
      rest.includes("-a");




    switch(cmd){



      case "help":

        print("AVAILABLE TASK COMMANDS");

        print("ls");

        print("ls -a");

        print("cd <folder>");

        print("cat <file>");

        print("pwd");

        print("clear");

        break;




      case "pwd":

        print(cwd);

        break;





      case "clear":

        setLines([]);

        break;





      case "ls":{

        const entry=FS[cwd];


        if(!entry || entry.type!=="dir"){

          print("DIRECTORY ERROR");

          break;

        }



        const visible=
          entry.children.filter(
            item=>
            showHidden ||
            !item.startsWith(".")
          );



        print(
          visible.length
          ?
          visible.join("     ")
          :
          "(EMPTY)"
        );


        break;

      }
      case "cd":{


        const next=
          resolvePath(
            cwd,
            arg
          );


        if(
          FS[next] &&
          FS[next].type==="dir"
        ){

          setCwd(next);

        }
        else{

          print("DIRECTORY NOT FOUND");

        }


        break;

      }







      case "cat":{


        const next=
          resolvePath(
            cwd,
            arg
          );



        if(
          FS[next] &&
          FS[next].type==="file"
        ){

          print(
            FS[next].content
          );

        }
        else{

          print("FILE NOT FOUND");

        }


        break;

      }





      default:

        print("UNKNOWN COMMAND");

        break;


    }


  }





  function handleSubmit(e){

    e.preventDefault();


    runCommand(input);


    setInput("");

  }






  return (

    <div
      className="
      w-full
      "
    >



      {/* COMPUTER CASING -- black chassis, green trim, hard comic
          shadow to match the sticker theme on Home/Story/Victory. */}

      <div
        className="
        border-[3px]
        border-black
        bg-[#0c0f0d]
        p-3
        shadow-[6px_6px_0_0_#000]
        "
      >





        {/* HEADER */}

        <div
          className="
          flex
          items-center
          gap-2.5
          border-b-[3px]
          border-[#63ff9a]
          bg-black
          px-5
          py-3
          "
        >

          {/* Little monitor glyph so the header itself reads as a
              green-on-black computer, not just the screen below. */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#63ff9a"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0"
          >
            <rect x="3" y="4" width="18" height="13" rx="1.5" />
            <path d="M7 8.5 9.8 11 7 13.5M12 13.5h4.2" />
            <path d="M9 20h6M12 17v3" />
          </svg>

          <h2
            className="
            font-display
            text-xl
            font-black
            uppercase
            tracking-wide
            text-[#63ff9a]
            "
          >

            CREW TERMINAL

          </h2>


        </div>






        {/* SCREEN -- output history + the live prompt line share this
            one black surface now, so typing a command happens directly
            in the terminal beside "$" instead of in a separate boxed
            input below it. */}

        <div

          ref={scrollRef}

          onClick={() => inputRef.current?.focus()}

          className="
          h-52
          cursor-text
          overflow-y-auto
          border-x
          border-[#1c3a2b]
          bg-[#05080b]
          px-5
          py-4
          font-mono
          text-sm
          leading-7
          text-[#63ff9a]
          sm:h-64
          "

        >

          {lines.map((line,i)=>(

            <div
              key={i}
              className="
              break-words
              "
            >

              {line}

            </div>

          ))}

          {/* Live prompt -- no border, no background box, just the
              next line of the terminal. */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">

            <span className="shrink-0 text-[#63ff9a]">
              {cwd} $
            </span>

            <input

              ref={inputRef}

              autoFocus

              value={input}

              onChange={
                e=>setInput(e.target.value)
              }

              spellCheck={false}

              autoComplete="off"

              placeholder=""

              className="
              min-w-0
              flex-1
              bg-transparent
              font-mono
              text-[#63ff9a]
              caret-[#63ff9a]
              outline-none
              focus:outline-none
              focus-visible:outline-none
              "

              style={{ boxShadow: "none" }}

            />

          </form>


        </div>







        {/* HINT STRIP -- plain text, same terminal surface, no boxed
            panel underneath it. */}

        <div
          className="
          flex
          justify-between
          border-x
          border-b
          border-[#1c3a2b]
          bg-[#05080b]
          px-5
          py-2.5
          font-mono
          text-xs
          uppercase
          tracking-wide
          text-[#2f6b4c]
          "
        >

          <span>
            ls &middot; cd &middot; cat &middot; pwd
          </span>


          <span>
            Enter &crarr;
          </span>


        </div>




      </div>


    </div>

  );

}
