import React from 'react';
import config from 'config';
import Box from '@mui/material/Box';
import { makeStyles } from 'tss-react/mui';
import { Typography } from '@mui/material';

function WormholeLogo(props: { color: string }) {
  return (
    <svg
      width="227"
      height="24"
      viewBox="0 0 227 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.23295 17V6.81818H4.6733C5.47206 6.81818 6.125 6.96236 6.6321 7.25071C7.14252 7.53575 7.52036 7.92188 7.76562 8.40909C8.01089 8.89631 8.13352 9.43987 8.13352 10.0398C8.13352 10.6397 8.01089 11.1849 7.76562 11.6754C7.52367 12.166 7.14915 12.5571 6.64205 12.8487C6.13494 13.1371 5.48532 13.2812 4.69318 13.2812H2.22727V12.1875H4.65341C5.20028 12.1875 5.63944 12.093 5.97088 11.9041C6.30232 11.7152 6.54261 11.46 6.69176 11.1385C6.84422 10.8137 6.92045 10.4474 6.92045 10.0398C6.92045 9.6321 6.84422 9.26752 6.69176 8.94602C6.54261 8.62453 6.30066 8.37263 5.96591 8.19034C5.63116 8.00473 5.18703 7.91193 4.63352 7.91193H2.46591V17H1.23295ZM12.9808 17.1591C12.2914 17.1591 11.6866 16.995 11.1662 16.6669C10.6491 16.3388 10.2448 15.8797 9.95312 15.2898C9.66477 14.6998 9.5206 14.0104 9.5206 13.2216C9.5206 12.4261 9.66477 11.7318 9.95312 11.1385C10.2448 10.5452 10.6491 10.0845 11.1662 9.75639C11.6866 9.42827 12.2914 9.2642 12.9808 9.2642C13.6702 9.2642 14.2734 9.42827 14.7905 9.75639C15.3108 10.0845 15.7152 10.5452 16.0036 11.1385C16.2952 11.7318 16.4411 12.4261 16.4411 13.2216C16.4411 14.0104 16.2952 14.6998 16.0036 15.2898C15.7152 15.8797 15.3108 16.3388 14.7905 16.6669C14.2734 16.995 13.6702 17.1591 12.9808 17.1591ZM12.9808 16.1051C13.5045 16.1051 13.9354 15.9709 14.2734 15.7024C14.6115 15.4339 14.8617 15.081 15.0241 14.6435C15.1866 14.206 15.2678 13.732 15.2678 13.2216C15.2678 12.7112 15.1866 12.2356 15.0241 11.7947C14.8617 11.3539 14.6115 10.9976 14.2734 10.7259C13.9354 10.4541 13.5045 10.3182 12.9808 10.3182C12.4571 10.3182 12.0263 10.4541 11.6882 10.7259C11.3501 10.9976 11.0999 11.3539 10.9375 11.7947C10.7751 12.2356 10.6939 12.7112 10.6939 13.2216C10.6939 13.732 10.7751 14.206 10.9375 14.6435C11.0999 15.081 11.3501 15.4339 11.6882 15.7024C12.0263 15.9709 12.4571 16.1051 12.9808 16.1051ZM19.7024 17L17.3757 9.36364H18.6087L20.2592 15.2102H20.3388L21.9695 9.36364H23.2223L24.8331 15.1903H24.9126L26.5632 9.36364H27.7962L25.4695 17H24.3161L22.6456 11.1335H22.5263L20.8558 17H19.7024ZM32.2892 17.1591C31.5534 17.1591 30.9187 16.9967 30.3851 16.6719C29.8548 16.3438 29.4455 15.8864 29.1571 15.2997C28.8721 14.7098 28.7296 14.0237 28.7296 13.2415C28.7296 12.4593 28.8721 11.7699 29.1571 11.1733C29.4455 10.5734 29.8465 10.1061 30.3603 9.77131C30.8773 9.43324 31.4805 9.2642 32.1699 9.2642C32.5676 9.2642 32.9604 9.33049 33.3482 9.46307C33.736 9.59564 34.089 9.81108 34.4071 10.1094C34.7253 10.4044 34.9789 10.7955 35.1678 11.2827C35.3567 11.7699 35.4512 12.3698 35.4512 13.0824V13.5795H29.5648V12.5653H34.258C34.258 12.1345 34.1718 11.75 33.9995 11.4119C33.8304 11.0739 33.5885 10.8071 33.2736 10.6115C32.9621 10.416 32.5942 10.3182 32.1699 10.3182C31.7026 10.3182 31.2982 10.4342 30.9569 10.6662C30.6188 10.8949 30.3586 11.1932 30.1763 11.5611C29.994 11.929 29.9029 12.3234 29.9029 12.7443V13.4205C29.9029 13.9972 30.0023 14.486 30.2012 14.8871C30.4033 15.2848 30.6834 15.5881 31.0414 15.7969C31.3993 16.0024 31.8153 16.1051 32.2892 16.1051C32.5975 16.1051 32.8759 16.062 33.1245 15.9759C33.3764 15.8864 33.5935 15.7538 33.7757 15.5781C33.958 15.3991 34.0989 15.1771 34.1983 14.9119L35.3319 15.2301C35.2125 15.6146 35.012 15.9527 34.7303 16.2443C34.4486 16.5327 34.1006 16.758 33.6863 16.9205C33.272 17.0795 32.8063 17.1591 32.2892 17.1591ZM37.236 17V9.36364H38.3695V10.517H38.449C38.5882 10.1392 38.8401 9.83262 39.2047 9.5973C39.5693 9.36198 39.9803 9.24432 40.4377 9.24432C40.5239 9.24432 40.6316 9.24597 40.7608 9.24929C40.8901 9.2526 40.9879 9.25758 41.0542 9.2642V10.4574C41.0144 10.4474 40.9232 10.4325 40.7807 10.4126C40.6415 10.3894 40.494 10.3778 40.3382 10.3778C39.967 10.3778 39.6356 10.4557 39.3439 10.6115C39.0556 10.764 38.8269 10.9761 38.6578 11.2479C38.4921 11.5163 38.4093 11.8229 38.4093 12.1676V17H37.236ZM45.4142 17.1591C44.6784 17.1591 44.0437 16.9967 43.5101 16.6719C42.9798 16.3438 42.5705 15.8864 42.2821 15.2997C41.9971 14.7098 41.8546 14.0237 41.8546 13.2415C41.8546 12.4593 41.9971 11.7699 42.2821 11.1733C42.5705 10.5734 42.9715 10.1061 43.4853 9.77131C44.0023 9.43324 44.6055 9.2642 45.2949 9.2642C45.6926 9.2642 46.0854 9.33049 46.4732 9.46307C46.861 9.59564 47.214 9.81108 47.5321 10.1094C47.8503 10.4044 48.1039 10.7955 48.2928 11.2827C48.4817 11.7699 48.5762 12.3698 48.5762 13.0824V13.5795H42.6898V12.5653H47.383C47.383 12.1345 47.2968 11.75 47.1245 11.4119C46.9554 11.0739 46.7135 10.8071 46.3986 10.6115C46.0871 10.416 45.7192 10.3182 45.2949 10.3182C44.8276 10.3182 44.4232 10.4342 44.0819 10.6662C43.7438 10.8949 43.4836 11.1932 43.3013 11.5611C43.119 11.929 43.0279 12.3234 43.0279 12.7443V13.4205C43.0279 13.9972 43.1273 14.486 43.3262 14.8871C43.5283 15.2848 43.8084 15.5881 44.1664 15.7969C44.5243 16.0024 44.9403 16.1051 45.4142 16.1051C45.7225 16.1051 46.0009 16.062 46.2495 15.9759C46.5014 15.8864 46.7185 15.7538 46.9007 15.5781C47.083 15.3991 47.2239 15.1771 47.3233 14.9119L48.4569 15.2301C48.3375 15.6146 48.137 15.9527 47.8553 16.2443C47.5736 16.5327 47.2256 16.758 46.8113 16.9205C46.397 17.0795 45.9313 17.1591 45.4142 17.1591ZM53.2445 17.1591C52.6081 17.1591 52.0463 16.9983 51.5591 16.6768C51.0719 16.352 50.6908 15.8946 50.4157 15.3047C50.1406 14.7114 50.003 14.0104 50.003 13.2017C50.003 12.3996 50.1406 11.7036 50.4157 11.1136C50.6908 10.5237 51.0736 10.0679 51.5641 9.74645C52.0546 9.42495 52.6214 9.2642 53.2644 9.2642C53.7615 9.2642 54.1543 9.34706 54.4426 9.51278C54.7343 9.67519 54.9564 9.8608 55.1088 10.0696C55.2646 10.2751 55.3856 10.4441 55.4718 10.5767H55.5712V6.81818H56.7445V17H55.611V15.8267H55.4718C55.3856 15.9659 55.263 16.1416 55.1039 16.3537C54.9448 16.5625 54.7177 16.7498 54.4228 16.9155C54.1278 17.0779 53.735 17.1591 53.2445 17.1591ZM53.4036 16.1051C53.8742 16.1051 54.272 15.9825 54.5968 15.7372C54.9216 15.4886 55.1685 15.1456 55.3375 14.7081C55.5066 14.2673 55.5911 13.7585 55.5911 13.1818C55.5911 12.6117 55.5082 12.1129 55.3425 11.6854C55.1768 11.2545 54.9315 10.9197 54.6067 10.6811C54.2819 10.4392 53.8809 10.3182 53.4036 10.3182C52.9064 10.3182 52.4921 10.4458 52.1607 10.701C51.8326 10.9529 51.5856 11.2959 51.4199 11.7301C51.2575 12.161 51.1763 12.6449 51.1763 13.1818C51.1763 13.7254 51.2592 14.2192 51.4249 14.6634C51.5939 15.1042 51.8425 15.4555 52.1706 15.7173C52.5021 15.9759 52.9131 16.1051 53.4036 16.1051ZM63.1529 17V6.81818H66.7125C67.4218 6.81818 68.0068 6.94081 68.4675 7.18608C68.9282 7.42803 69.2712 7.7545 69.4966 8.16548C69.722 8.57315 69.8347 9.02557 69.8347 9.52273C69.8347 9.96023 69.7568 10.3215 69.601 10.6065C69.4486 10.8916 69.2464 11.117 68.9945 11.2827C68.7459 11.4484 68.4758 11.571 68.1841 11.6506V11.75C68.4957 11.7699 68.8089 11.8793 69.1238 12.0781C69.4386 12.277 69.7021 12.562 69.9142 12.9332C70.1264 13.3045 70.2324 13.7585 70.2324 14.2955C70.2324 14.8059 70.1164 15.2649 69.8844 15.6726C69.6524 16.0803 69.2862 16.4034 68.7857 16.642C68.2852 16.8807 67.6339 17 66.8319 17H63.1529ZM64.3858 15.9062H66.8319C67.6373 15.9062 68.209 15.7505 68.5471 15.4389C68.8884 15.1241 69.0591 14.7429 69.0591 14.2955C69.0591 13.9508 68.9713 13.6326 68.7956 13.3409C68.62 13.0459 68.3697 12.8106 68.0449 12.6349C67.7201 12.456 67.3356 12.3665 66.8915 12.3665H64.3858V15.9062ZM64.3858 11.2926H66.6728C67.044 11.2926 67.3787 11.2197 67.677 11.0739C67.9786 10.928 68.2173 10.7225 68.3929 10.4574C68.5719 10.1922 68.6614 9.88068 68.6614 9.52273C68.6614 9.07528 68.5056 8.69579 68.1941 8.38423C67.8825 8.06937 67.3887 7.91193 66.7125 7.91193H64.3858V11.2926ZM72.8549 19.8636C72.6561 19.8636 72.4788 19.8471 72.323 19.8139C72.1672 19.7841 72.0595 19.7543 71.9998 19.7244L72.2981 18.6903C72.5832 18.7633 72.835 18.7898 73.0538 18.7699C73.2725 18.75 73.4664 18.6522 73.6355 18.4766C73.8078 18.3042 73.9653 18.0241 74.1078 17.6364L74.3265 17.0398L71.5027 9.36364H72.7754L74.8833 15.4489H74.9629L77.0708 9.36364H78.3436L75.1021 18.1136C74.9563 18.508 74.7756 18.8345 74.5602 19.093C74.3448 19.3549 74.0945 19.5488 73.8095 19.6747C73.5278 19.8007 73.2096 19.8636 72.8549 19.8636Z"
        fill={props.color}
        fillOpacity="0.6"
      />
      <path
        d="M133.698 7.32755L130.547 16.1698C130.533 16.2126 130.504 16.2492 130.466 16.2741C130.429 16.2989 130.383 16.3104 130.338 16.3069H130.099C130.054 16.3087 130.009 16.2965 129.971 16.2719C129.933 16.2474 129.903 16.2117 129.886 16.1698L127.524 9.96839L125.166 16.1698C125.15 16.2118 125.121 16.2476 125.084 16.2723C125.046 16.2969 125.001 16.309 124.956 16.3069H124.714C124.669 16.3094 124.624 16.2974 124.586 16.2727C124.549 16.248 124.52 16.212 124.505 16.1698L121.354 7.33064C121.305 7.19361 121.358 7.10844 121.492 7.10844H122.467C122.513 7.10384 122.559 7.1149 122.598 7.13982C122.636 7.16473 122.665 7.202 122.68 7.24548L124.926 13.9401L127.21 7.80911C127.226 7.76689 127.255 7.7309 127.294 7.70629C127.332 7.68168 127.377 7.6697 127.423 7.67207H127.628C127.673 7.66981 127.717 7.68189 127.755 7.70654C127.793 7.73119 127.821 7.76713 127.837 7.80911L130.188 13.9401L132.382 7.24548C132.397 7.202 132.426 7.16473 132.464 7.13982C132.503 7.1149 132.549 7.10384 132.595 7.10844H133.556C133.694 7.10844 133.746 7.19361 133.698 7.32755"
        fill={props.color}
      />
      <path
        d="M147.413 11.6335C147.404 12.5442 147.124 13.432 146.608 14.1849C146.091 14.9379 145.362 15.5225 144.512 15.865C143.661 16.2075 142.728 16.2926 141.829 16.1096C140.93 15.9266 140.105 15.4837 139.46 14.8366C138.814 14.1896 138.375 13.3673 138.199 12.4735C138.024 11.5796 138.118 10.6541 138.471 9.81351C138.825 8.97292 139.421 8.25486 140.184 7.74975C140.948 7.24465 141.845 6.9751 142.763 6.97506C143.38 6.96645 143.992 7.0814 144.563 7.31303C145.134 7.54465 145.652 7.88819 146.086 8.3231C146.52 8.758 146.861 9.27533 147.089 9.84414C147.317 10.4129 147.427 11.0215 147.413 11.6335V11.6335ZM146.123 11.6335C146.123 9.48971 144.714 8.01328 142.763 8.01328C140.812 8.01328 139.403 9.48971 139.403 11.6335C139.403 13.7773 140.812 15.2537 142.763 15.2537C144.714 15.2537 146.123 13.7773 146.123 11.6335Z"
        fill={props.color}
      />
      <path
        d="M159.728 15.791C159.758 15.8251 159.776 15.8674 159.781 15.9122C159.786 15.9571 159.777 16.0023 159.756 16.0421C159.734 16.0818 159.701 16.1142 159.661 16.1349C159.62 16.1556 159.575 16.1636 159.53 16.158H158.651C158.623 16.1571 158.595 16.1493 158.57 16.1351C158.545 16.1209 158.524 16.1008 158.509 16.0767L156.304 12.7754H153.935V15.973C153.934 16.022 153.915 16.069 153.88 16.1037C153.845 16.1384 153.797 16.1582 153.748 16.1588H152.89C152.84 16.158 152.793 16.1381 152.758 16.1034C152.724 16.0687 152.704 16.0219 152.703 15.973V7.29323C152.704 7.24433 152.724 7.19765 152.759 7.16299C152.793 7.12834 152.84 7.10842 152.89 7.10742H156.265C158.627 7.10742 159.793 8.3392 159.793 9.94105C159.808 10.5776 159.592 11.1982 159.186 11.6907C158.779 12.1833 158.209 12.5153 157.577 12.6268L159.728 15.791ZM156.024 11.7372C157.881 11.7372 158.505 10.9731 158.505 9.94182C158.505 8.91057 157.881 8.14642 156.024 8.14642H153.934V11.7372H156.024Z"
        fill={props.color}
      />
      <path
        d="M174.242 6.96207H174.522C174.547 6.96048 174.572 6.96419 174.595 6.97297C174.619 6.98174 174.64 6.99538 174.658 7.01296C174.675 7.03054 174.689 7.05167 174.698 7.07493C174.707 7.0982 174.711 7.12307 174.709 7.14788V15.9739C174.711 15.9987 174.707 16.0236 174.698 16.0469C174.689 16.0701 174.675 16.0913 174.658 16.1088C174.64 16.1264 174.619 16.1401 174.595 16.1488C174.572 16.1576 174.547 16.1613 174.522 16.1597H173.664C173.639 16.1613 173.613 16.1576 173.59 16.1488C173.567 16.1401 173.545 16.1264 173.528 16.1088C173.51 16.0913 173.496 16.0701 173.487 16.0469C173.478 16.0236 173.475 15.9987 173.476 15.9739V9.70821L170.019 14.6748C170.007 14.6993 169.989 14.7201 169.966 14.7347C169.943 14.7493 169.917 14.7571 169.889 14.7571C169.862 14.7571 169.836 14.7493 169.813 14.7347C169.79 14.7201 169.772 14.6993 169.76 14.6748L166.303 9.70821V15.9732C166.305 15.998 166.301 16.0228 166.292 16.0461C166.284 16.0694 166.27 16.0905 166.252 16.1081C166.234 16.1257 166.213 16.1393 166.19 16.1481C166.166 16.1568 166.141 16.1606 166.116 16.159H165.258C165.233 16.1606 165.208 16.1568 165.184 16.1481C165.161 16.1393 165.14 16.1257 165.122 16.1081C165.104 16.0905 165.09 16.0694 165.082 16.0461C165.073 16.0228 165.069 15.998 165.071 15.9732V7.14711C165.069 7.12229 165.073 7.09743 165.082 7.07416C165.09 7.0509 165.104 7.02977 165.122 7.01219C165.14 6.9946 165.161 6.98097 165.184 6.9722C165.208 6.96342 165.233 6.9597 165.258 6.9613H165.535C165.581 6.96146 165.627 6.97308 165.668 6.99511C165.709 7.01713 165.743 7.04888 165.769 7.08749L169.888 12.7958L174.011 7.08749C174.035 7.04907 174.068 7.01734 174.108 6.99527C174.148 6.9732 174.193 6.96151 174.239 6.9613"
        fill={props.color}
      />
      <path
        d="M188.578 7.29323V15.9722C188.577 16.0212 188.557 16.068 188.522 16.1027C188.488 16.1374 188.44 16.1572 188.391 16.158H187.533C187.483 16.1572 187.436 16.1374 187.401 16.1027C187.366 16.068 187.346 16.0212 187.346 15.9722V12.0183H181.668V15.9722C181.667 16.0212 181.647 16.068 181.612 16.1027C181.578 16.1374 181.53 16.1572 181.481 16.158H180.623C180.573 16.1572 180.526 16.1374 180.491 16.1027C180.456 16.068 180.436 16.0212 180.436 15.9722V7.29323C180.436 7.2442 180.456 7.1974 180.491 7.16273C180.526 7.12805 180.573 7.10822 180.623 7.10742H181.481C181.53 7.10822 181.578 7.12805 181.612 7.16273C181.647 7.1974 181.667 7.2442 181.668 7.29323V10.98H187.346V7.29323C187.346 7.2442 187.366 7.1974 187.401 7.16273C187.436 7.12805 187.483 7.10822 187.533 7.10742H188.391C188.44 7.10822 188.488 7.12805 188.522 7.16273C188.557 7.1974 188.577 7.2442 188.578 7.29323Z"
        fill={props.color}
      />
      <path
        d="M203.167 11.6335C203.158 12.5442 202.878 13.432 202.361 14.1849C201.845 14.9379 201.116 15.5225 200.266 15.865C199.415 16.2075 198.482 16.2926 197.583 16.1096C196.684 15.9266 195.859 15.4837 195.213 14.8366C194.568 14.1896 194.129 13.3673 193.953 12.4735C193.777 11.5796 193.872 10.6541 194.225 9.81351C194.579 8.97292 195.175 8.25486 195.938 7.74975C196.702 7.24465 197.599 6.9751 198.517 6.97506C199.134 6.96645 199.746 7.0814 200.317 7.31303C200.888 7.54465 201.406 7.88819 201.84 8.3231C202.274 8.758 202.615 9.27533 202.843 9.84414C203.071 10.4129 203.181 11.0215 203.167 11.6335V11.6335ZM201.877 11.6335C201.877 9.48971 200.468 8.01328 198.517 8.01328C196.566 8.01328 195.157 9.48971 195.157 11.6335C195.157 13.7773 196.566 15.2537 198.517 15.2537C200.468 15.2537 201.877 13.7773 201.877 11.6335Z"
        fill={props.color}
      />
      <path
        d="M214.912 15.3048V15.9722C214.914 15.997 214.91 16.0219 214.901 16.0451C214.892 16.0684 214.879 16.0895 214.861 16.1071C214.843 16.1247 214.822 16.1383 214.798 16.1471C214.775 16.1559 214.75 16.1596 214.725 16.158H208.644C208.595 16.1572 208.548 16.1374 208.513 16.1027C208.478 16.068 208.458 16.0212 208.457 15.9722V7.29323C208.458 7.2442 208.478 7.1974 208.513 7.16273C208.548 7.12805 208.595 7.10822 208.644 7.10742H209.502C209.552 7.10842 209.599 7.12834 209.633 7.16299C209.668 7.19765 209.688 7.24433 209.689 7.29323V15.119H214.727C214.752 15.1174 214.777 15.1211 214.801 15.1299C214.824 15.1387 214.846 15.1523 214.863 15.1699C214.881 15.1875 214.895 15.2086 214.904 15.2319C214.912 15.2551 214.916 15.28 214.915 15.3048"
        fill={props.color}
      />
      <path
        d="M226.762 15.3052V15.9725C226.763 15.9973 226.759 16.0222 226.751 16.0455C226.742 16.0687 226.728 16.0899 226.71 16.1075C226.693 16.125 226.671 16.1387 226.648 16.1474C226.624 16.1562 226.599 16.1599 226.574 16.1583H220.008C219.958 16.1575 219.911 16.1377 219.876 16.103C219.841 16.0684 219.821 16.0216 219.82 15.9725V7.29359C219.821 7.24456 219.841 7.19776 219.876 7.16309C219.911 7.12841 219.958 7.10858 220.008 7.10778H226.425C226.45 7.10619 226.475 7.10991 226.499 7.11868C226.522 7.12746 226.544 7.14109 226.561 7.15867C226.579 7.17625 226.593 7.19738 226.602 7.22065C226.61 7.24391 226.614 7.26878 226.613 7.29359V7.96097C226.614 7.98578 226.61 8.01065 226.602 8.03391C226.593 8.05718 226.579 8.0783 226.561 8.09589C226.544 8.11347 226.522 8.1271 226.499 8.13588C226.475 8.14465 226.45 8.14837 226.425 8.14678H221.051V10.9804H225.828C225.852 10.9789 225.877 10.9825 225.9 10.991C225.923 10.9996 225.944 11.0129 225.962 11.03C225.979 11.0472 225.993 11.0679 226.002 11.0907C226.011 11.1135 226.015 11.1379 226.014 11.1623V11.8336C226.016 11.8583 226.012 11.883 226.003 11.9061C225.994 11.9292 225.98 11.9502 225.963 11.9677C225.945 11.9852 225.924 11.9987 225.901 12.0075C225.877 12.0163 225.853 12.0201 225.828 12.0186H221.051V15.1194H226.575C226.6 15.1178 226.625 15.1215 226.649 15.1302C226.672 15.139 226.693 15.1527 226.711 15.1702C226.729 15.1878 226.742 15.209 226.751 15.2322C226.76 15.2555 226.764 15.2803 226.762 15.3052"
        fill={props.color}
      />
      <path
        d="M101.01 24C97.8272 23.998 94.7753 22.7335 92.5237 20.4839C90.2721 18.2344 89.0049 15.1835 89 12.0008C89.0049 8.81788 90.2721 5.76688 92.5236 3.51709C94.7751 1.2673 97.8271 0.00244275 101.01 0C104.193 0.00244275 107.245 1.2673 109.496 3.51709C111.748 5.76688 113.015 8.81788 113.02 12.0008C113.015 15.1835 111.748 18.2344 109.496 20.4839C107.245 22.7335 104.193 23.998 101.01 24ZM101.01 0.923847C98.072 0.925882 95.2548 2.09328 93.1764 4.1699C91.0981 6.24652 89.9283 9.06277 89.9238 12.0008C89.9267 14.9391 91.096 17.7562 93.1747 19.8329C95.2535 21.9096 98.0716 23.0762 101.01 23.0762C103.948 23.0762 106.767 21.9096 108.845 19.8329C110.924 17.7562 112.093 14.9391 112.096 12.0008C112.092 9.06277 110.922 6.24652 108.844 4.1699C106.765 2.09328 103.948 0.925882 101.01 0.923847V0.923847Z"
        fill={props.color}
      />
      <path
        d="M102.528 22.103C99.891 22.101 97.3626 21.0531 95.4973 19.1892C93.632 17.3254 92.5822 14.7978 92.5781 12.1609C92.5822 9.52399 93.632 6.99637 95.4973 5.13252C97.3626 3.26867 99.891 2.22079 102.528 2.21875C105.165 2.22079 107.693 3.26867 109.559 5.13252C111.424 6.99637 112.474 9.52399 112.478 12.1609C112.474 14.7978 111.424 17.3254 109.559 19.1892C107.693 21.0531 105.165 22.101 102.528 22.103ZM102.528 2.93628C100.081 2.93831 97.7357 3.91065 96.0052 5.63998C94.2747 7.36931 93.3008 9.71443 93.2972 12.1609C93.3012 14.6071 94.2753 16.9518 96.0058 18.6808C97.7362 20.4098 100.082 21.3819 102.528 21.3839C104.974 21.3819 107.32 20.4098 109.05 18.6808C110.781 16.9518 111.755 14.6071 111.759 12.1609C111.755 9.7147 110.781 7.36996 109.05 5.64096C107.32 3.91196 104.974 2.93985 102.528 2.93782V2.93628Z"
        fill={props.color}
      />
      <path
        d="M104.046 20.2045C101.955 20.2029 99.9501 19.3719 98.4711 17.894C96.992 16.4161 96.1595 14.4119 96.1562 12.321C96.1595 10.2301 96.992 8.22586 98.4711 6.74794C99.9501 5.27003 101.955 4.43913 104.046 4.4375C106.137 4.43872 108.142 5.26949 109.621 6.74749C111.1 8.22549 111.933 10.23 111.936 12.321C111.932 14.4119 111.1 16.4161 109.621 17.894C108.142 19.3719 106.137 20.2029 104.046 20.2045V20.2045ZM104.046 4.95023C102.091 4.95145 100.216 5.7282 98.8331 7.11004C97.4501 8.49189 96.6718 10.3659 96.669 12.321C96.6722 14.2758 97.4507 16.1494 98.8337 17.5309C100.217 18.9124 102.091 19.689 104.046 19.6902C106.001 19.689 107.875 18.9124 109.258 17.5309C110.641 16.1494 111.42 14.2758 111.423 12.321C111.42 10.3659 110.642 8.49189 109.259 7.11004C107.876 5.7282 106.001 4.95145 104.046 4.95023V4.95023Z"
        fill={props.color}
      />
      <path
        d="M105.566 18.3055C104.021 18.3043 102.54 17.6904 101.447 16.5984C100.354 15.5064 99.7388 14.0256 99.7363 12.4807C99.7384 10.9355 100.353 9.45427 101.446 8.36196C102.539 7.26965 104.021 6.65552 105.566 6.6543C107.111 6.65552 108.593 7.26965 109.685 8.36196C110.778 9.45427 111.393 10.9355 111.395 12.4807C111.393 14.0256 110.778 15.5064 109.685 16.5984C108.592 17.6904 107.111 18.3043 105.566 18.3055V18.3055ZM105.566 6.96225C104.102 6.96347 102.699 7.54515 101.664 8.57971C100.629 9.61427 100.046 11.0172 100.044 12.4807C100.047 13.9439 100.629 15.3464 101.664 16.3806C102.7 17.4149 104.103 17.9964 105.566 17.9976C107.029 17.9964 108.432 17.4149 109.467 16.3806C110.502 15.3464 111.085 13.9439 111.087 12.4807C111.085 11.0172 110.503 9.61427 109.468 8.57971C108.433 7.54515 107.029 6.96347 105.566 6.96225Z"
        fill={props.color}
      />
    </svg>
  );
}

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  partnerLogo: {
    maxHeight: theme.spacing(3),
  },
  separator: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

function PartnerLogo(props: { src: string }) {
  const { classes } = useStyles();
  return <img src={props.src} alt="partner" className={classes.partnerLogo} />;
}

function PoweredByIcon(props: { color: string }) {
  const { classes } = useStyles();
  return config.partnerLogo ? (
    <Box className={classes.container}>
      <WormholeLogo color={props.color} />
      <Typography component="span" className={classes.separator}>
        &
      </Typography>
      <PartnerLogo src={config.partnerLogo} />
    </Box>
  ) : (
    <WormholeLogo color={props.color} />
  );
}

export default PoweredByIcon;
