import React from 'react';

function SOL() {
  // return (
  //   <svg
  //     width="36"
  //     height="36"
  //     viewBox="0 0 36 36"
  //     fill="none"
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <rect width="36" height="36" rx="6" fill="black" />
  //     <path
  //       d="M10.4854 22.4808C10.6216 22.3449 10.8064 22.2687 10.999 22.2687H28.7693C29.093 22.2687 29.255 22.6593 29.026 22.8877L25.5147 26.3893C25.3784 26.5252 25.1937 26.6015 25.0011 26.6015H7.23081C6.9071 26.6015 6.74507 26.2108 6.97406 25.9825L10.4854 22.4808Z"
  //       fill="url(#paint0_linear_85_9551)"
  //     />
  //     <path
  //       d="M10.4854 9.39895C10.6216 9.26308 10.8064 9.18677 10.999 9.18677H28.7693C29.093 9.18677 29.255 9.57744 29.026 9.80581L25.5147 13.3074C25.3784 13.4433 25.1937 13.5196 25.0011 13.5196H7.23081C6.9071 13.5196 6.74507 13.129 6.97406 12.9006L10.4854 9.39895Z"
  //       fill="url(#paint1_linear_85_9551)"
  //     />
  //     <path
  //       d="M25.5147 15.8982C25.3784 15.7624 25.1937 15.686 25.0011 15.686H7.23081C6.9071 15.686 6.74507 16.0767 6.97406 16.305L10.4854 19.8067C10.6216 19.9425 10.8064 20.0189 10.999 20.0189H28.7693C29.093 20.0189 29.255 19.6282 29.026 19.3998L25.5147 15.8982Z"
  //       fill="url(#paint2_linear_85_9551)"
  //     />
  //     <defs>
  //       <linearGradient
  //         id="paint0_linear_85_9551"
  //         x1="21.9203"
  //         y1="4.40983"
  //         x2="9.65997"
  //         y2="27.9398"
  //         gradientUnits="userSpaceOnUse"
  //       >
  //         <stop stopColor="#00FFA3" />
  //         <stop offset="1" stopColor="#DC1FFF" />
  //       </linearGradient>
  //       <linearGradient
  //         id="paint1_linear_85_9551"
  //         x1="21.9203"
  //         y1="4.40982"
  //         x2="9.65999"
  //         y2="27.9398"
  //         gradientUnits="userSpaceOnUse"
  //       >
  //         <stop stopColor="#00FFA3" />
  //         <stop offset="1" stopColor="#DC1FFF" />
  //       </linearGradient>
  //       <linearGradient
  //         id="paint2_linear_85_9551"
  //         x1="21.9203"
  //         y1="4.40983"
  //         x2="9.66001"
  //         y2="27.9398"
  //         gradientUnits="userSpaceOnUse"
  //       >
  //         <stop stopColor="#00FFA3" />
  //         <stop offset="1" stopColor="#DC1FFF" />
  //       </linearGradient>
  //     </defs>
  //   </svg>
  // );
  return (
    <img
      width="36"
      height="36"
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHJ4PSI2IiBmaWxsPSJibGFjayI+PC9yZWN0PjxwYXRoIGQ9Ik0xMC40ODU0IDIyLjQ4MDhDMTAuNjIxNiAyMi4zNDQ5IDEwLjgwNjQgMjIuMjY4NyAxMC45OTkgMjIuMjY4N0gyOC43NjkzQzI5LjA5MyAyMi4yNjg3IDI5LjI1NSAyMi42NTkzIDI5LjAyNiAyMi44ODc3TDI1LjUxNDcgMjYuMzg5M0MyNS4zNzg0IDI2LjUyNTIgMjUuMTkzNyAyNi42MDE1IDI1LjAwMTEgMjYuNjAxNUg3LjIzMDgxQzYuOTA3MSAyNi42MDE1IDYuNzQ1MDcgMjYuMjEwOCA2Ljk3NDA2IDI1Ljk4MjVMMTAuNDg1NCAyMi40ODA4WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzg1Xzk1NTEpIj48L3BhdGg+PHBhdGggZD0iTTEwLjQ4NTQgOS4zOTg5NUMxMC42MjE2IDkuMjYzMDggMTAuODA2NCA5LjE4Njc3IDEwLjk5OSA5LjE4Njc3SDI4Ljc2OTNDMjkuMDkzIDkuMTg2NzcgMjkuMjU1IDkuNTc3NDQgMjkuMDI2IDkuODA1ODFMMjUuNTE0NyAxMy4zMDc0QzI1LjM3ODQgMTMuNDQzMyAyNS4xOTM3IDEzLjUxOTYgMjUuMDAxMSAxMy41MTk2SDcuMjMwODFDNi45MDcxIDEzLjUxOTYgNi43NDUwNyAxMy4xMjkgNi45NzQwNiAxMi45MDA2TDEwLjQ4NTQgOS4zOTg5NVoiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl84NV85NTUxKSI+PC9wYXRoPjxwYXRoIGQ9Ik0yNS41MTQ3IDE1Ljg5ODJDMjUuMzc4NCAxNS43NjI0IDI1LjE5MzcgMTUuNjg2IDI1LjAwMTEgMTUuNjg2SDcuMjMwODFDNi45MDcxIDE1LjY4NiA2Ljc0NTA3IDE2LjA3NjcgNi45NzQwNiAxNi4zMDVMMTAuNDg1NCAxOS44MDY3QzEwLjYyMTYgMTkuOTQyNSAxMC44MDY0IDIwLjAxODkgMTAuOTk5IDIwLjAxODlIMjguNzY5M0MyOS4wOTMgMjAuMDE4OSAyOS4yNTUgMTkuNjI4MiAyOS4wMjYgMTkuMzk5OEwyNS41MTQ3IDE1Ljg5ODJaIiBmaWxsPSJ1cmwoI3BhaW50Ml9saW5lYXJfODVfOTU1MSkiPjwvcGF0aD48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfODVfOTU1MSIgeDE9IjIxLjkyMDMiIHkxPSI0LjQwOTgzIiB4Mj0iOS42NTk5NyIgeTI9IjI3LjkzOTgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMDBGRkEzIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjREMxRkZGIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfODVfOTU1MSIgeDE9IjIxLjkyMDMiIHkxPSI0LjQwOTgyIiB4Mj0iOS42NTk5OSIgeTI9IjI3LjkzOTgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMDBGRkEzIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjREMxRkZGIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Ml9saW5lYXJfODVfOTU1MSIgeDE9IjIxLjkyMDMiIHkxPSI0LjQwOTgzIiB4Mj0iOS42NjAwMSIgeTI9IjI3LjkzOTgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMDBGRkEzIj48L3N0b3A+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjREMxRkZGIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+"
      alt="SOL"
    />
  );
}

export default SOL;
