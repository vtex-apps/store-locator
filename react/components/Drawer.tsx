import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'drawerBackdrop',
  'drawerBackdropActive',
  'drawer',
  'drawerActive',
  'drawerContainer',
  'drawerHeader',
  'drawerTitle',
  'drawerClose',
  'drawerHeaderOption',
  'drawerContent'
] as const

interface DrawerProps  {
  children: React.ReactNode
  title: string
  headerOption: React.ReactNode
  active: boolean
  onClose: React.ReactNode
}

const Drawer = ({children, title, headerOption, active, onClose}: DrawerProps) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <>
      <div className={`${handles.drawerBackdrop} ${active ? handles.drawerBackdropActive : ''}`}></div>
      <div className={`${handles.drawer} ${active ? handles.drawerActive : ''}`}>
        <div className={handles.drawerClose}>
          {onClose}
        </div>
        <div className={handles.drawerContainer}>
          <div className={handles.drawerHeader}>
            <span className={handles.drawerTitle}>
              {title}
            </span>
            <div className={handles.drawerHeaderOption}>
              {headerOption}
            </div>
          </div>
          <div className={handles.drawerContent}>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Drawer
