const CRATE_LABEL =
  "UkVRLTQ0NzE6IHNpZ25lZCBvdXQgYnkgUi4gVm9zcyAtLSBubyBsYWIgY2xlYXJhbmNlIG9uIGZpbGUuIEZMQUd7YmFzZTY0X2lzbnRfZW5jcnlwdGlvbn0=";

/*
  Storage Bay -- crate label evidence.

  This used to have its own "Decode" button that base64-decoded the
  label for the player, which defeated the point of the puzzle. Now
  it's just evidence: the player has to decode the label themselves
  (any base64 decoder works) and submit the flag they find in the
  main answer box below.
*/
export default function StorageCrate() {
  return (
    <div
      className="
      border-[3px]
      border-black
      bg-[#14100a]
      p-4
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
        border-[#FFC24B]
        pb-3
        "
      >

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFC24B"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0"
        >
          <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z" />
          <path d="M3 7.5v9L12 21l9-4.5v-9" />
          <path d="M12 12v9" />
        </svg>

        <h3
          className="
          font-display
          text-sm
          font-black
          uppercase
          tracking-widest
          text-[#FFC24B]
          "
        >
          Crate Label
        </h3>

      </div>

      {/* THE LABEL ITSELF -- read it, decode it off-app */}
      <pre
        className="
        mt-3
        overflow-x-auto
        whitespace-pre-wrap
        break-all
        border-[3px]
        border-[#3a2f18]
        bg-black
        px-4
        py-3
        font-mono
        text-xs
        text-[#FFC24B]
        "
      >
        {CRATE_LABEL}
      </pre>

      <p
        className="
        mt-3
        font-mono
        text-[11px]
        uppercase
        tracking-wide
        text-[#8a7847]
        "
      >
        Decode the label yourself, then enter the flag below.
      </p>

    </div>
  );
}
