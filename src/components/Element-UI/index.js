/**
 * @desc element-ui
 * @author Jooger <zzy1198258955@163.com>
 * @date 9 Oct 2017
 */

'use strict'

import Vue from 'vue'
import {
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Message,
  MessageBox,
  Button,
  ButtonGroup,
  Menu,
  Submenu,
  MenuItem,
  Tooltip,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Card,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  Input,
  Form,
  FormItem,
  Loading,
  Badge,
  Select,
  Option,
  Dialog,
  Autocomplete,
  Switch,
  DatePicker,
  Upload,
  Radio,
  RadioGroup,
  InputNumber
} from 'element-ui'

Vue.use(Loading)

Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Container.name, Container)
Vue.component(Header.name, Header)
Vue.component(Aside.name, Aside)
Vue.component(Main.name, Main)
Vue.component(Footer.name, Footer)
Vue.component(Button.name, Button)
Vue.component(ButtonGroup.name, ButtonGroup)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Tabs.name, Tabs)
Vue.component(TabPane.name, TabPane)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Card.name, Card)
Vue.component(Tag.name, Tag)
Vue.component(Breadcrumb.name, Breadcrumb)
Vue.component(BreadcrumbItem.name, BreadcrumbItem)
Vue.component(Pagination.name, Pagination)
Vue.component(Input.name, Input)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Badge.name, Badge)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.component(Dialog.name, Dialog)
Vue.component(Autocomplete.name, Autocomplete)
Vue.component(Switch.name, Switch)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Upload.name, Upload)
Vue.component(Radio.name, Radio)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(InputNumber.name, InputNumber)
