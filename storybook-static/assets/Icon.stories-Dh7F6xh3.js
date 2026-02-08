import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{I as D}from"./Badge-DEuHeGQz.js";import"./IconButton-CoE3UwQk.js";import{H as t}from"./heart-YVLjfoYM.js";import{c as w}from"./createLucideIcon-Dn7aSrF3.js";import{S as E}from"./search-B5Dlvyh2.js";import"./index-DwQS_Y10.js";/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],F=w("star",P),G={title:"Foundations/Icon",component:D,tags:["autodocs"],argTypes:{size:{control:"radio",options:["sm","md","lg"]},color:{control:"radio",options:["primary","muted","accent"]}}},e={args:{size:"md",color:"muted",children:r.jsx(t,{})}},s={args:{size:"sm",color:"muted",children:r.jsx(F,{size:16})}},o={args:{size:"lg",color:"muted",children:r.jsx(E,{size:32})}},a={args:{size:"md",color:"primary",children:r.jsx(t,{})}},n={args:{size:"md",color:"accent",children:r.jsx(t,{fill:"currentColor"})}},c={render:()=>{const M=["sm","md","lg"],_=["primary","muted","accent"],k={sm:16,md:24,lg:32};return r.jsx("div",{style:{display:"flex",flexDirection:"column",gap:16},children:_.map(i=>r.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[r.jsx("span",{style:{width:60,fontSize:12,color:"#717171"},children:i}),M.map(l=>r.jsx(D,{size:l,color:i,children:r.jsx(t,{size:k[l]})},l))]},i))})}};var m,d,p;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    size: 'md',
    color: 'muted',
    children: <Heart />
  }
}`,...(p=(d=e.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var u,g,z;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    color: 'muted',
    children: <Star size={16} />
  }
}`,...(z=(g=s.parameters)==null?void 0:g.docs)==null?void 0:z.source}}};var y,x,S;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    color: 'muted',
    children: <Search size={32} />
  }
}`,...(S=(x=o.parameters)==null?void 0:x.docs)==null?void 0:S.source}}};var h,f,j;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    size: 'md',
    color: 'primary',
    children: <Heart />
  }
}`,...(j=(f=a.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var C,I,v;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    size: 'md',
    color: 'accent',
    children: <Heart fill="currentColor" />
  }
}`,...(v=(I=n.parameters)==null?void 0:I.docs)==null?void 0:v.source}}};var A,H,L;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    const colors = ['primary', 'muted', 'accent'] as const;
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
        alignItems: 'center'
      }}>
            <span style={{
          width: 60,
          fontSize: 12,
          color: '#717171'
        }}>{color}</span>
            {sizes.map(size => <Icon key={size} size={size} color={color}>
                <Heart size={iconSizeMap[size]} />
              </Icon>)}
          </div>)}
      </div>;
  }
}`,...(L=(H=c.parameters)==null?void 0:H.docs)==null?void 0:L.source}}};const J=["Default","Small","Large","PrimaryColor","AccentColor","AllSizesAndColors"];export{n as AccentColor,c as AllSizesAndColors,e as Default,o as Large,a as PrimaryColor,s as Small,J as __namedExportsOrder,G as default};
