import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as t}from"./SectionTitle-OUIKQWJq.js";import"./IconButton-CMgH9GM-.js";const z={title:"Foundations/Button",component:t,tags:["autodocs"],parameters:{docs:{description:{component:"Primary, secondary, and ghost variants. Medium size only. Each has hover and press (active) states."}}},argTypes:{variant:{control:"radio",options:["primary","secondary","ghost"]},onClick:{action:"clicked"}}},a={args:{variant:"primary",size:"md",children:"Reserve"}},e={args:{variant:"secondary",size:"md",children:"Share"}},s={args:{variant:"ghost",size:"md",children:"View listing"}},n={render:()=>r.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[r.jsx(t,{variant:"primary",children:"Primary"}),r.jsx(t,{variant:"secondary",children:"Secondary"}),r.jsx(t,{variant:"ghost",children:"Ghost"})]})};var o,i,c;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Reserve'
  }
}`,...(c=(i=a.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var d,m,p;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Share'
  }
}`,...(p=(m=e.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var l,y,h;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    size: 'md',
    children: 'View listing'
  }
}`,...(h=(y=s.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var u,g,v;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
}`,...(v=(g=n.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const j=["Primary","Secondary","Ghost","AllVariants"];export{n as AllVariants,s as Ghost,a as Primary,e as Secondary,j as __namedExportsOrder,z as default};
