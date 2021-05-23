Page({

  data: {
    ordersList: {
      all: [],
      pendingPayment: [],
      pendingUsed: [],
      pendingEvaluated: [],
      refundsAftermarket:[]
    }
  },

  onLoad: function (options) {
    this.setData({
      active: parseInt(options.active)
    })
  },

  onChange(event) {
    this.setData({
      active: event.detail.index
    })
  },
})