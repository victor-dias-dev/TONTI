import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { IconName } from '../domain';
import { useColors } from '../theme';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color }: IconProps) {
  const palette = useColors();
  const stroke = color ?? palette.primary;
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };

  switch (name) {
    case 'home':
      return (
        <Svg {...common}>
          <Path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"
            stroke={stroke}
            strokeWidth={1.7}
          />
        </Svg>
      );
    case 'transactions':
      return (
        <Svg {...common}>
          <Path
            d="M7 7h13M7 12h13M7 17h13"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
          <Circle cx={4} cy={7} r={1.2} fill={stroke} />
          <Circle cx={4} cy={12} r={1.2} fill={stroke} />
          <Circle cx={4} cy={17} r={1.2} fill={stroke} />
        </Svg>
      );
    case 'planning':
      return (
        <Svg {...common}>
          <Path d="M4 19V6M4 19h16" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
          <Path
            d="M7 15l4-5 3 3 5-7"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'accounts':
      return (
        <Svg {...common}>
          <Rect x={3} y={6} width={18} height={12} rx={2} stroke={stroke} strokeWidth={1.7} />
          <Path d="M3 10h18" stroke={stroke} strokeWidth={1.7} />
        </Svg>
      );
    case 'more':
      return (
        <Svg {...common}>
          <Path
            d="M4 7h16M4 12h16M4 17h16"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'bell':
      return (
        <Svg {...common}>
          <Path
            d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9z"
            stroke={stroke}
            strokeWidth={1.7}
          />
          <Path
            d="M10 18.5a2 2 0 0 0 4 0"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...common}>
          <Path d="M12 5v14M5 12h14" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'search':
      return (
        <Svg {...common}>
          <Circle cx={11} cy={11} r={6} stroke={stroke} strokeWidth={1.7} />
          <Path d="M16 16l4 4" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
        </Svg>
      );
    case 'filter':
      return (
        <Svg {...common}>
          <Path
            d="M4 6h16l-6 7v5l-4 2v-7z"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'chevronLeft':
      return (
        <Svg {...common}>
          <Path
            d="M14 6l-6 6 6 6"
            stroke={stroke}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'chevronRight':
      return (
        <Svg {...common}>
          <Path
            d="M10 6l6 6-6 6"
            stroke={stroke}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'chevronDown':
      return (
        <Svg {...common}>
          <Path
            d="M6 10l6 6 6-6"
            stroke={stroke}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'close':
      return (
        <Svg {...common}>
          <Path d="M6 6l12 12M18 6 6 18" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...common}>
          <Path
            d="M5 12.5 10 17l9-10"
            stroke={stroke}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'bank':
      return (
        <Svg {...common}>
          <Path
            d="M4 10h16M5 10v8M19 10v8M3 18h18M12 4l9 6H3z"
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'wallet':
      return (
        <Svg {...common}>
          <Rect x={3} y={7} width={18} height={12} rx={2} stroke={stroke} strokeWidth={1.7} />
          <Path d="M15 13h4" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
        </Svg>
      );
    case 'card':
      return (
        <Svg {...common}>
          <Rect x={3} y={6} width={18} height={12} rx={2} stroke={stroke} strokeWidth={1.7} />
          <Path d="M3 10h18" stroke={stroke} strokeWidth={1.7} />
        </Svg>
      );
    case 'cash':
      return (
        <Svg {...common}>
          <Rect x={3} y={7} width={18} height={10} rx={2} stroke={stroke} strokeWidth={1.7} />
          <Circle cx={12} cy={12} r={2.2} stroke={stroke} strokeWidth={1.7} />
        </Svg>
      );
    case 'food':
      return (
        <Svg {...common}>
          <Path
            d="M8 3v8M8 11c0 3-3 3-3 7h6c0-4-3-4-3-7zM16 3v18"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'transport':
      return (
        <Svg {...common}>
          <Path d="M5 16V9l2-4h10l2 4v7" stroke={stroke} strokeWidth={1.7} strokeLinejoin="round" />
          <Circle cx={7.5} cy={17} r={1.5} fill={stroke} />
          <Circle cx={16.5} cy={17} r={1.5} fill={stroke} />
        </Svg>
      );
    case 'market':
      return (
        <Svg {...common}>
          <Path d="M6 8h15l-1.5 9H8z" stroke={stroke} strokeWidth={1.7} strokeLinejoin="round" />
          <Path d="M6 8 5 4H3" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
          <Circle cx={9} cy={20} r={1.2} fill={stroke} />
          <Circle cx={17} cy={20} r={1.2} fill={stroke} />
        </Svg>
      );
    case 'homeCategory':
      return (
        <Svg {...common}>
          <Path d="M4 11 12 5l8 6v8H4z" stroke={stroke} strokeWidth={1.7} strokeLinejoin="round" />
        </Svg>
      );
    case 'leisure':
      return (
        <Svg {...common}>
          <Circle cx={12} cy={12} r={7} stroke={stroke} strokeWidth={1.7} />
          <Path
            d="M8 14c1.2 1.4 2.6 2 4 2s2.8-.6 4-2"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
          <Circle cx={9} cy={10} r={1} fill={stroke} />
          <Circle cx={15} cy={10} r={1} fill={stroke} />
        </Svg>
      );
    case 'income':
      return (
        <Svg {...common}>
          <Rect x={4} y={7} width={16} height={11} rx={1.5} stroke={stroke} strokeWidth={1.7} />
          <Path d="M4 10h16" stroke={stroke} strokeWidth={1.7} />
        </Svg>
      );
    case 'subscription':
      return (
        <Svg {...common}>
          <Path d="M5 8a7 7 0 1 1 0 8" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
          <Path d="M5 5v4h4" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
        </Svg>
      );
    case 'flag':
      return (
        <Svg {...common}>
          <Path
            d="M6 4v16M6 5h11l-2 4 2 4H6"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'bulb':
      return (
        <Svg {...common}>
          <Path
            d="M9 18h6M10 21h4M8 14a5 5 0 1 1 8 0c0 2-1.5 3-1.5 3h-5S8 16 8 14z"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'arrowUp':
      return (
        <Svg {...common}>
          <Path
            d="M12 18V7M7 11l5-5 5 5"
            stroke={stroke}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'arrowDown':
      return (
        <Svg {...common}>
          <Path
            d="M12 6v11M7 13l5 5 5-5"
            stroke={stroke}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'user':
      return (
        <Svg {...common}>
          <Circle cx={12} cy={8} r={3.2} stroke={stroke} strokeWidth={1.7} />
          <Path
            d="M5 19c1.4-3 3.8-4.5 7-4.5S17.6 16 19 19"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'grid':
      return (
        <Svg {...common}>
          <Rect x={4} y={4} width={7} height={7} rx={1.2} stroke={stroke} strokeWidth={1.7} />
          <Rect x={13} y={4} width={7} height={7} rx={1.2} stroke={stroke} strokeWidth={1.7} />
          <Rect x={4} y={13} width={7} height={7} rx={1.2} stroke={stroke} strokeWidth={1.7} />
          <Rect x={13} y={13} width={7} height={7} rx={1.2} stroke={stroke} strokeWidth={1.7} />
        </Svg>
      );
    case 'settings':
      return (
        <Svg {...common}>
          <Circle cx={12} cy={12} r={3} stroke={stroke} strokeWidth={1.7} />
          <Path
            d="M12 3.5v2.2M12 18.3v2.2M4.7 7.2l1.9 1.1M17.4 15.7l1.9 1.1M4.7 16.8l1.9-1.1M17.4 8.3l1.9-1.1"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'lock':
      return (
        <Svg {...common}>
          <Rect x={6} y={10} width={12} height={10} rx={2} stroke={stroke} strokeWidth={1.7} />
          <Path d="M8 10V8a4 4 0 0 1 8 0v2" stroke={stroke} strokeWidth={1.7} />
        </Svg>
      );
    case 'crown':
      return (
        <Svg {...common}>
          <Path
            d="M4 16 6 8l6 5 6-5 2 8H4z"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'help':
      return (
        <Svg {...common}>
          <Circle cx={12} cy={12} r={8} stroke={stroke} strokeWidth={1.7} />
          <Path
            d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6V14"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
          <Circle cx={12} cy={17} r={0.8} fill={stroke} />
        </Svg>
      );
    case 'logout':
      return (
        <Svg {...common}>
          <Path
            d="M10 7V5a1 1 0 0 1 1-1h8v16h-8a1 1 0 0 1-1-1v-2"
            stroke={stroke}
            strokeWidth={1.7}
          />
          <Path
            d="M4 12h10M7 9l-3 3 3 3"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'edit':
      return (
        <Svg {...common}>
          <Path
            d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5z"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg {...common}>
          <Rect x={4} y={6} width={16} height={14} rx={2} stroke={stroke} strokeWidth={1.7} />
          <Path d="M8 4v4M16 4v4M4 10h16" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
        </Svg>
      );
    case 'repeat':
      return (
        <Svg {...common}>
          <Path
            d="M5 8h11l-2-2M19 16H8l2 2"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'installments':
      return (
        <Svg {...common}>
          <Path
            d="M7 7h13M7 12h13M7 17h10"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'robot':
      return (
        <Svg {...common}>
          <Path d="M12 8V5M9 5h6" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
          <Rect x={6} y={8} width={12} height={10} rx={2.5} stroke={stroke} strokeWidth={1.7} />
          <Circle cx={10} cy={12} r={1} fill={stroke} />
          <Circle cx={14} cy={12} r={1} fill={stroke} />
          <Path
            d="M9 16h6M4 13h2M18 13h2"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'savings':
      return (
        <Svg {...common}>
          <Path
            d="M16 8.5c.8.6 1.4 1.5 1.7 2.5H20v3h-2.1c-.2 1.3-.8 2.4-1.7 3.3-.9.8-2.1 1.2-3.7 1.2-1.2 0-2.2-.2-3-.7H8.2L6 16.2V14c-1.2-.8-2-2-2-3.5C4 7.8 7.1 5 12 5c1.6 0 3 .4 4 1.1z"
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          <Circle cx={15} cy={11.5} r={0.9} fill={stroke} />
          <Path d="M9 19v2M15 19v2" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
        </Svg>
      );
    case 'mic':
      return (
        <Svg {...common}>
          <Rect x={9} y={3.5} width={6} height={10} rx={3} stroke={stroke} strokeWidth={1.7} />
          <Path
            d="M7 12a5 5 0 0 0 10 0M12 17v3M9.5 20h5"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'send':
      return (
        <Svg {...common}>
          <Path
            d="M4 12 20 4l-6.5 16-1.8-6.2L4 12z"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'play':
      return (
        <Svg {...common}>
          <Circle cx={12} cy={12} r={8} stroke={stroke} strokeWidth={1.7} />
          <Path d="M10 9.2 16 12l-6 2.8V9.2z" fill={stroke} />
        </Svg>
      );
    case 'music':
      return (
        <Svg {...common}>
          <Path d="M10 18V7l9-2v11" stroke={stroke} strokeWidth={1.7} strokeLinejoin="round" />
          <Circle cx={8} cy={18} r={2.2} stroke={stroke} strokeWidth={1.7} />
          <Circle cx={17} cy={16} r={2.2} stroke={stroke} strokeWidth={1.7} />
        </Svg>
      );
    case 'truck':
      return (
        <Svg {...common}>
          <Path
            d="M3 16V8h11v8H3zM14 11h3.5L20 14v2h-6v-5z"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
          <Circle cx={7} cy={17.5} r={1.5} fill={stroke} />
          <Circle cx={17} cy={17.5} r={1.5} fill={stroke} />
        </Svg>
      );
    case 'sync':
      return (
        <Svg {...common}>
          <Path
            d="M5.5 12a6.5 6.5 0 0 1 10.4-5.2L18 9"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
          <Path d="M18 5.5V9h-3.5" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
          <Path
            d="M18.5 12a6.5 6.5 0 0 1-10.4 5.2L6 15"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
          <Path d="M6 18.5V15h3.5" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
        </Svg>
      );
    case 'sparkle':
      return (
        <Svg {...common}>
          <Path
            d="M12 3.5 13.4 9 19 10.5 13.4 12 12 17.5 10.6 12 5 10.5 10.6 9z"
            stroke={stroke}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          <Path
            d="M18 14.5 18.7 17 21 17.7 18.7 18.4 18 21l-.7-2.6L15 17.7l2.3-.7z"
            fill={stroke}
          />
        </Svg>
      );
    case 'pieChart':
      return (
        <Svg {...common}>
          <Circle cx={12} cy={12} r={8} stroke={stroke} strokeWidth={1.7} />
          <Path d="M12 4v8h8" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
        </Svg>
      );
    case 'shield':
      return (
        <Svg {...common}>
          <Path
            d="M12 3.5 19 7v5.2c0 4.3-2.9 7.2-7 8.3-4.1-1.1-7-4-7-8.3V7z"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
          <Rect x={9.5} y={11} width={5} height={4.5} rx={0.8} stroke={stroke} strokeWidth={1.5} />
          <Path d="M10.5 11V9.8a1.5 1.5 0 0 1 3 0V11" stroke={stroke} strokeWidth={1.5} />
        </Svg>
      );
    case 'link':
      return (
        <Svg {...common}>
          <Path
            d="M10 13.5a3.8 3.8 0 0 0 5.4.2l1.8-1.8a3.8 3.8 0 1 0-5.4-5.4L10.7 8"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
          <Path
            d="M14 10.5a3.8 3.8 0 0 0-5.4-.2L6.8 12.1a3.8 3.8 0 1 0 5.4 5.4L13.3 16"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'eyeOff':
      return (
        <Svg {...common}>
          <Path
            d="M4 12s3.2-5.5 8-5.5S20 12 20 12s-3.2 5.5-8 5.5S4 12 4 12z"
            stroke={stroke}
            strokeWidth={1.7}
          />
          <Circle cx={12} cy={12} r={2.2} stroke={stroke} strokeWidth={1.7} />
          <Path d="M5 19 19 5" stroke={stroke} strokeWidth={1.7} strokeLinecap="round" />
        </Svg>
      );
    case 'trash':
      return (
        <Svg {...common}>
          <Path
            d="M5 7h14M9 7V5h6v2M8 7l.8 12h6.4L16 7"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'headset':
      return (
        <Svg {...common}>
          <Path
            d="M5 13v-1a7 7 0 0 1 14 0v1"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
          <Rect x={3.5} y={12} width={4} height={6} rx={1.5} stroke={stroke} strokeWidth={1.7} />
          <Rect x={16.5} y={12} width={4} height={6} rx={1.5} stroke={stroke} strokeWidth={1.7} />
          <Path
            d="M20.5 17v1a2 2 0 0 1-2 2H14"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'rocket':
      return (
        <Svg {...common}>
          <Path
            d="M12 3c3 2.2 5 6 5 10.2 0 1.4-.3 2.6-.8 3.8H7.8C7.3 15.8 7 14.6 7 13.2 7 9 9 5.2 12 3z"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
          <Circle cx={12} cy={10} r={1.6} stroke={stroke} strokeWidth={1.6} />
          <Path
            d="M8.2 17.2 7 21l3.2-1.4M15.8 17.2 17 21l-3.2-1.4"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'exchange':
      return (
        <Svg {...common}>
          <Path
            d="M5 8h11l-2.5-2.5M19 16H8l2.5 2.5"
            stroke={stroke}
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    default:
      return (
        <Svg {...common}>
          <Circle cx={12} cy={12} r={7} stroke={stroke} strokeWidth={1.7} />
        </Svg>
      );
  }
}
