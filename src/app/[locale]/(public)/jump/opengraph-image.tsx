import {ImageResponse} from 'next/og';
export const alt='TrackJump — Find your vertical. One iPhone.';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{width:'100%',height:'100%',background:'#FFFFF9',display:'flex',padding:'70px',color:'#17232C',flexDirection:'column',justifyContent:'space-between'}}><div style={{fontSize:24,letterSpacing:'5px'}}>TRACKJUMP / TRACKSPEED FAMILY</div><div style={{fontSize:92,fontWeight:700,letterSpacing:'-5px',lineHeight:1.02,display:'flex',flexDirection:'column'}}><div>Your next personal best.</div><div style={{color:'#5C8DB8'}}>Now measurable.</div></div><div style={{display:'flex',fontSize:26,justifyContent:'space-between'}}><span>Jump height · Reactive strength · One iPhone</span><span>In development</span></div></div>,{...size})}
