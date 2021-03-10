import api from "@/utils/api";
import Order from "@/models/order";
import newOrder from "@/models/NewOrder";
export default {
  state: () => ({
    orders: [],
    filterStatus: -1,
    filterSite: "",
    filterUser: -1,
    filterCountry: -1,
    page: 1,
    rowsPerPage: 10,
    total: 0,
    fetching: false,
    editingOrder: newOrder(),
    editDialog: false
  }),

  mutations: {},

  getters: {},

  actions: {
    async fetchOrders({ state }) {
      const { filterSite, filterStatus, filterUser, filterCountry } = state;
      const payload = {
        page: state.page,
        rowsPerPage: state.rowsPerPage
      };
      if (filterSite.length) payload[`orders.Site`] = filterSite;
      if (filterStatus != -1) payload[`orders.Status`] = filterStatus;
      if (filterCountry != -1) payload[`orders.Country`] = filterCountry;
      if (filterUser != -1) payload[`orders.UserId`] = filterUser;
      state.fetching = true;
      const { data, total } = await api.fetchOrders(payload);
      state.orders = data.map(_i => new Order(_i));
      state.total = total;
      state.fetching = false;
    },
    async fetchOrderCol({ state }, { table, colName }) {
      const { data = [] } = await api.fetchOrderCol({ table, colName });
      return data;
    },
    async updateStatus({ state, dispatch }, { status, id }) {
      await api.updateStatus({ id, status });
      dispatch("fetchOrders");
    },
    async deleteOrder({ state, dispatch }, id) {
      await api.deleteOrder({ id });
      dispatch("fetchOrders");
    },
    async createOrder({ state, dispatch }, id) {
      await api.createOrder({ id });
      dispatch("fetchOrders");
    },
    async updateOrder({ state, dispatch }, order) {
      await api.updateOrder({ order });
      dispatch("fetchOrders");
    },
    changeRowsPerPage({ state, dispatch }, value) {
      state.rowsPerPage = value;
      state.page = 1;
      dispatch("fetchOrders");
    },
    changePage({ state, dispatch }, value) {
      state.page = value;
      dispatch("fetchOrders");
    },
    changeFilterSite({ state, dispatch }, value) {
      state.filterSite = value || "";
      state.page = 1;
      dispatch("fetchOrders");
    },
    changeFilterUser({ state, dispatch }, value) {
      state.filterUser = value || -1;
      state.page = 1;
      dispatch("fetchOrders");
    },
    changeFilterStatus({ state, dispatch }, value) {
      const _v = value === null ? -1 : value;
      state.filterStatus = _v;
      state.page = 1;
      dispatch("fetchOrders");
    },
    changeFilterCountry({ state, dispatch }, value) {
      state.filterCountry = value || -1;
      state.page = 1;
      dispatch("fetchOrders");
    },
    setEditingOrder({ state }, value) {
      state.editingOrder = value;
    },
    setEditDialog({ state }, value) {
      state.editDialog = value;
    }
  },
  namespaced: true
};