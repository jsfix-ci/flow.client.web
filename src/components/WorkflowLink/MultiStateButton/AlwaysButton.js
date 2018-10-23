import React from "react";
import PropTypes from "prop-types";
const AlwaysButton = ({ className, ...rest }) => {
  return (
    <svg
      className={className}
      width="13px"
      height="14px"
      viewBox="0 0 13 14"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <defs>
        <linearGradient id="linearGradient1697">
          <stop stop-color="#0e56db" offset="0" id="stop1698" />
          <stop stop-color="#071176" offset="1" id="stop1699" />
        </linearGradient>
        <linearGradient
          y2="0.07748"
          y1="0.07748"
          href="#linearGradient1697"
          x2="0.491802"
          x1="0.491802"
          id="linearGradient1077"
        />
      </defs>
      <g>
        <title>Layer 1</title>
        <g id="layer1">
          <path
            fill="#4c4c4c"
            fill-rule="nonzero"
            stroke="url(#linearGradient1077)"
            stroke-width="1.364453"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="4"
            stroke-dashoffset="0"
            id="path1070"
            d="m518.368164,224.390503a190.403656,190.403656 0 1 1-380.807343,0a190.403656,190.403656 0 1 1380.807343,0z"
          />
          <path
            opacity="0.9"
            fill="#4c4c4c"
            fill-rule="evenodd"
            stroke-width="0.25000000pt"
            id="path1713"
            d="m466.278198,174.236725c44.367188,-0.966797 -12.400146,-123.152878 -135.681,-123.802788c-134.561539,-0.687119 -162.095963,110.961372 -140.719467,112.997231c0,0 36.864166,5.062607 71.93959,14.856064c56.472656,15.930817 125.549133,-13.069229 152.768738,-17.283585c30.342499,-4.697876 47.373444,15.392426 51.692139,13.233078z"
          />
        </g>
      </g>
    </svg>
  );
};

export default AlwaysButton;
