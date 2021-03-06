import api from "@/utils/api";
import Transfer from "@/models/transfer";
const initState = () => ({
  transfers: [],
  filterStatus: -1,
  filterType: "",
  filterUser: -1,
  filterCountry: -1,
  filterOrder: -1,
  page: 1,
  rowsPerPage: 10,
  sortCol: "TransferId",
  total: 0,
  totalTransfer: 0,
  fetching: false,
  editingTransfer: null,
  createDialog: false,
  editDialog: false,
  multiSelected: []
})
export default {
  state: initState(),

  mutations: {},

  getters: {
    conditionPayload: state => {
      const { filterUser, filterOrder } = state;
      const payload = {};
      if (filterUser != -1) payload[`UserId`] = filterUser;
      if (filterOrder != -1) payload[`Status`] = filterOrder;
      return payload;
    }
  },

  actions: {
    async fetchTransfers({ state }) {
      const { filterType, filterStatus, filterUser, filterCountry } = state;
      const payload = {
        page: state.page,
        rowsPerPage: state.rowsPerPage,
        sortCol: state.sortCol
      };
      if (filterType) payload[`transfer.Type`] = filterType;
      if (filterStatus != -1) payload[`transfer.Status`] = filterStatus;
      if (filterCountry != -1) payload[`transfer.Country`] = filterCountry;
      if (filterUser != -1) payload[`transfer.UserId`] = filterUser;
      state.fetching = true;
      const { data, total, totalTransfer } = await api.fetchTransfers(payload);
      state.transfers = data.map(_i => new Transfer(_i));
      state.total = total;
      state.totalTransfer = totalTransfer;
      state.fetching = false;
    },
    async fetchTransferCol({ state }, { table, colName, conditions }) {
      const { data = [] } = await api.fetchTransferCol({
        table,
        colName,
        conditions
      });
      return data;
    },
    async updateStatus({ state, dispatch }, { status, id }) {
      await api.updateTransferStatus({ id, status });
      dispatch("fetchTransfers");
    },
    async deleteTransfer({ state, dispatch }, id) {
      await api.deleteTransfer({ id });
      dispatch("fetchTransfers");
    },
    async createTransfer({ state, dispatch }, transfer) {
      await api.createTransfer({ transfer });
      dispatch("fetchTransfers");
      alert("SUCCESS");
    },
    async updateTransfer({ state, dispatch }, { id, transfer }) {
      const transferData = { ...transfer };
      delete transferData.user;
      delete transferData.transferId;
      await api.updateTransfer({ id, transfer: transferData });
      dispatch("fetchTransfers");
    },
    async changeMultiStatus({ state, dispatch }, status) {
      const selectedArray = state.multiSelected;
      await api.updateStatus({ id: selectedArray, status });
      dispatch("fetchTransfers");
    },
    changeRowsPerPage({ state, dispatch }, value) {
      state.rowsPerPage = value;
      state.page = 1;
      dispatch("fetchTransfers");
    },
    changePage({ state, dispatch }, value) {
      state.page = value;
      dispatch("fetchTransfers");
    },
    changeFilterType({ state, dispatch }, value) {
      state.filterType = value || "";
      state.page = 1;
      dispatch("fetchTransfers");
    },
    changeFilterUser({ state, dispatch }, value) {
      state.filterUser = value || -1;
      state.page = 1;
      dispatch("fetchTransfers");
    },
    changeFilterStatus({ state, dispatch }, value) {
      const _v = value === null ? -1 : value;
      state.filterStatus = _v;
      state.page = 1;
      dispatch("fetchTransfers");
    },
    changeFilterCountry({ state, dispatch }, value) {
      state.filterCountry = value || -1;
      state.page = 1;
      dispatch("fetchTransfers");
    },
    changeFilterOrder({ state, dispatch }, value) {
      state.filterOrder = value || -1;
      state.page = 1;
      dispatch("fetchTransfers");
    },
    setEditingTransfer({ state }, value) {
      state.editingTransfer = value;
    },
    setEditDialog({ state }, value) {
      state.editDialog = value;
    },
    setCreateDialog({ state }, value) {
      state.createDialog = value;
    },
    setMultiSelected({ state }, value) {
      state.multiSelected = value;
    },
    setSortCol({ state, dispatch }, value) {
      state.sortCol = value;
      dispatch("fetchTransfers");
    },
    reset({ state }) {
      Object.assign(state, initState())
    }
  },
  namespaced: true
};
