import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{I as R}from"./SectionTitle-OUIKQWJq.js";import"./IconButton-CMgH9GM-.js";import{H as o,S as P}from"./search-De7yGF5O.js";import{S as _}from"./star-Am54yE1A.js";import"./createLucideIcon-CJ_m3CD5.js";import"./index-BCtMShv3.js";const K={title:"Foundations/Icon",component:R,tags:["autodocs"],argTypes:{size:{control:"radio",options:["sm","md","lg"]},color:{control:"radio",options:["primary","muted","accent","white"]}}},s={args:{size:"md",color:"muted",children:r.jsx(o,{})}},a={args:{size:"sm",color:"muted",children:r.jsx(_,{size:16})}},t={args:{size:"lg",color:"muted",children:r.jsx(P,{size:32})}},c={args:{size:"md",color:"primary",children:r.jsx(o,{})}},i={args:{size:"md",color:"accent",children:r.jsx(o,{fill:"currentColor"})}},n={args:{size:"md",color:"white",children:r.jsx(o,{fill:"none",stroke:"currentColor",strokeWidth:2})},parameters:{backgrounds:{default:"dark"}},decorators:[l=>r.jsx("div",{style:{padding:24,background:"#333"},children:r.jsx(l,{})})]},d={render:()=>{const l=["sm","md","lg"],E=["primary","muted","accent","white"],L={sm:16,md:24,lg:32};return r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:16},children:E.map(e=>r.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center",background:e==="white"?"#333":void 0,padding:e==="white"?8:0,borderRadius:4},children:[r.jsx("span",{style:{width:60,fontSize:12,color:e==="white"?"#fff":"#717171"},children:e}),l.map(m=>r.jsx(R,{size:m,color:e,children:r.jsx(o,{size:L[m],stroke:"currentColor",strokeWidth:2})},m))]},e))})}};var p,u,g;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    size: 'md',
    color: 'muted',
    children: <Heart />
  }
}`,...(g=(u=s.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,z,f;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    color: 'muted',
    children: <Star size={16} />
  }
}`,...(f=(z=a.parameters)==null?void 0:z.docs)==null?void 0:f.source}}};var y,S,x;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    color: 'muted',
    children: <Search size={32} />
  }
}`,...(x=(S=t.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var k,j,C;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    size: 'md',
    color: 'primary',
    children: <Heart />
  }
}`,...(C=(j=c.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var w,v,b;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    size: 'md',
    color: 'accent',
    children: <Heart fill="currentColor" />
  }
}`,...(b=(v=i.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var H,I,A;n.parameters={...n.parameters,docs:{...(H=n.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    size: 'md',
    color: 'white',
    children: <Heart fill="none" stroke="currentColor" strokeWidth={2} />
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  decorators: [Story => <div style={{
    padding: 24,
    background: '#333'
  }}>
        <Story />
      </div>]
}`,...(A=(I=n.parameters)==null?void 0:I.docs)==null?void 0:A.source}}};var W,D,M;d.parameters={...d.parameters,docs:{...(W=d.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    const colors = ['primary', 'muted', 'accent', 'white'] as const;
    const iconSizeMap = {
      sm: 16,
      md: 24,
      lg: 32
    };
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
        {colors.map(color => <div key={color} style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        background: color === 'white' ? '#333' : undefined,
        padding: color === 'white' ? 8 : 0,
        borderRadius: 4
      }}>
            <span style={{
          width: 60,
          fontSize: 12,
          color: color === 'white' ? '#fff' : '#717171'
        }}>
              {color}
            </span>
            {sizes.map(size => <Icon key={size} size={size} color={color}>
                <Heart size={iconSizeMap[size]} stroke="currentColor" strokeWidth={2} />
              </Icon>)}
          </div>)}
      </div>;
  }
}`,...(M=(D=d.parameters)==null?void 0:D.docs)==null?void 0:M.source}}};const N=["Default","Small","Large","PrimaryColor","AccentColor","WhiteColor","AllSizesAndColors"];export{i as AccentColor,d as AllSizesAndColors,s as Default,t as Large,c as PrimaryColor,a as Small,n as WhiteColor,N as __namedExportsOrder,K as default};
