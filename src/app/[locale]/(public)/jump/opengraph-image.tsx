import {ImageResponse} from 'next/og';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

export const alt='TrackJump — Vertical testing on your phone.';
export const size={width:1200,height:630};
export const contentType='image/png';

export default async function Image(){
  // A real session frame: TrackJump on a tripod showing a 16.9 in countermovement jump.
  const photo=await readFile(join(process.cwd(),'public/photos/trackjump/share-photo.jpg'));
  const photoSrc=`data:image/jpeg;base64,${photo.toString('base64')}`;
  return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',background:'#f4f5f5',color:'#192b30'}}>
    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'64px 56px 60px 72px'}}>
      <div style={{fontSize:19,letterSpacing:'3px',color:'#466970'}}>TRACKJUMP / FROM THE TRACKSPEED FAMILY</div>
      <div style={{display:'flex',flexDirection:'column',fontSize:86,fontWeight:700,letterSpacing:'-4px',lineHeight:1.02}}><div>Vertical testing</div><div>on your phone.</div></div>
      <div style={{display:'flex',flexDirection:'column',gap:10,fontSize:26,color:'#536369'}}><span>Jump height · Reactive strength · Left &amp; right</span><span style={{color:'#234f58'}}>Available on the App Store</span></div>
    </div>
    <img src={photoSrc} alt="" width={460} height={630} style={{width:460,height:630,objectFit:'cover'}}/>
  </div>,{...size});
}
