import React from 'react'

function onRoomRead (data) {
  const oldState = this.isLocked
  this.isLocked = data.access ? data.access.lock : false

  if (oldState !== this.isLocked) {
    this.api('renderControls')
  }
}

function onRoomEnter (data) {
  this.inDaChat = true
  this.isLocked = data.isLocked
  this.addIcon()
}

function onRoomExit () {
  this.inDaChat = false
}

function onRoomLockSet (data) {
  this.isLocked = data
  this.api('renderControls')
}

XROOM_PLUGIN({

  inDaChat: false,
  isLocked: false,

  events: {
    'ss/onReadRoom': onRoomRead,
    'ss/lockSet': onRoomLockSet,
    'ss/onJoin': onRoomEnter,
    'room/exit': onRoomExit,
  },

  translations: {
    en: {
      iconCaptionOn: 'Locked',
      iconCaptionOff: 'Open',
      mbox: {
        enterFirst: 'Enter the room first',
        recommendation: 'Installing this plugin in a locked room may cause wrong indication.',
      },
    },
    sv: {
      iconCaptionOn: 'Låst',
      iconCaptionOff: 'Upplåst',
      mbox: {
        enterFirst: 'Gå in i rummet först',
        recommendation: 'Installing this plugin in a locked room may cause wrong indication.',
      },
    },
    ru: {
      iconCaptionOn: 'Закрыто',
      iconCaptionOff: 'Открыто',
      mbox: {
        enterFirst: 'Сначала войдите в комнату',
        recommendation: 'Установка плагина сразу внутри закрытой комнаты может привести к неправильной индикации.',
      },
    },
  },

  register ({roomId}) {
    this.addIcon()
    if (roomId) {
      this.inDaChat = true
      this.mbox({text: this.i18n.t('mbox.recommendation')})
    }
  },

  unregister () {
    this.api('removeIcon')
  },

  isSupported () {
    return true
  },

  addIcon () {
    const
      lockedString = 'M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z',
      unlockedString = 'M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,1 10,15A2,2 0 0,1 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17Z'

    this.api('addIcon', {
      title: () => this.i18n.t(this.isLocked ? 'iconCaptionOn' : 'iconCaptionOff'),
      onClick: () => this.toggleLock(),
      svg: props =>
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24">
          <path fill={props.color || '#000'} d={this.isLocked ? lockedString : unlockedString} />
        </svg>
    })
  },

  toggleLock () {
    if (this.inDaChat) {
      this.api('setRoomLock', !this.isLocked)
    } else {
      this.mbox({text: this.i18n.t('mbox.enterFirst')})
    }
  }
})
